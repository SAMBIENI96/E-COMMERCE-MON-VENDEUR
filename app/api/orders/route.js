import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { orderSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, badRequest, serverError } from '@/lib/api-helpers'

const round2 = (n) => Math.round(n * 100) / 100

// GET /api/orders - commandes de l'acheteur connecte
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                store: { select: { id: true, name: true, username: true, logo: true } },
                address: true,
                orderItems: {
                    include: { product: { select: { id: true, name: true, images: true } } },
                },
            },
        })

        return NextResponse.json({ orders })
    } catch (error) {
        return serverError('ORDERS_GET', error)
    }
}

// POST /api/orders - creer une commande (une par boutique)
export async function POST(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const body = await request.json()
        const parsed = orderSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }
        const { addressId, paymentMethod, items, couponCode } = parsed.data

        // Adresse appartenant a l'utilisateur
        const address = await prisma.address.findUnique({ where: { id: addressId } })
        if (!address || address.userId !== user.id) {
            return badRequest('Adresse invalide')
        }

        // Recuperer les produits en base (on ne fait JAMAIS confiance aux prix client)
        const productIds = [...new Set(items.map((i) => i.productId))]
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { store: { select: { id: true, name: true, status: true, isActive: true } } },
        })

        const productMap = new Map(products.map((p) => [p.id, p]))
        const missing = productIds.filter((id) => !productMap.has(id))
        if (missing.length > 0) {
            return badRequest('Un ou plusieurs produits sont introuvables')
        }

        // Regrouper par boutique + verifier la disponibilite
        const byStore = new Map()
        for (const item of items) {
            const product = productMap.get(item.productId)
            if (!product.inStock) {
                return badRequest(`Le produit "${product.name}" n'est plus en stock`)
            }
            if (product.store.status !== 'approved' || !product.store.isActive) {
                return badRequest(`La boutique "${product.store.name}" n'est pas disponible`)
            }
            if (!byStore.has(product.storeId)) byStore.set(product.storeId, [])
            byStore.get(product.storeId).push({ product, quantity: item.quantity })
        }

        // Coupon : valide uniquement sur une commande d'une seule boutique
        let coupon = null
        if (couponCode) {
            if (byStore.size > 1) {
                return badRequest('Un code promo ne s\'applique qu\'a une seule boutique a la fois')
            }
            const code = couponCode.trim().toUpperCase()
            const found = await prisma.coupon.findUnique({ where: { code } })
            if (!found) return badRequest('Code promo introuvable')
            if (found.expiresAt < new Date()) return badRequest('Ce code promo a expire')
            if (found.forMember && !user) return badRequest('Ce code est reserve aux membres')
            if (found.forNewUser) {
                const orderCount = await prisma.order.count({ where: { userId: user.id } })
                if (orderCount > 0) return badRequest('Ce code est reserve aux nouveaux clients')
            }
            coupon = found
        }

        // Construire les commandes (une par boutique)
        const ordersData = []
        for (const [storeId, storeItems] of byStore.entries()) {
            const subtotal = storeItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
            let total = subtotal
            let isCouponUsed = false
            let couponJson = {}

            if (coupon) {
                total = round2(subtotal - (coupon.discount / 100) * subtotal)
                isCouponUsed = true
                couponJson = { code: coupon.code, discount: coupon.discount, description: coupon.description }
            }

            ordersData.push({
                total: round2(total),
                userId: user.id,
                storeId,
                addressId,
                paymentMethod,
                isPaid: false,
                isCouponUsed,
                coupon: couponJson,
                orderItems: {
                    create: storeItems.map((i) => ({
                        productId: i.product.id,
                        quantity: i.quantity,
                        price: i.product.price,
                    })),
                },
            })
        }

        const orders = await prisma.$transaction(
            ordersData.map((data) =>
                prisma.order.create({
                    data,
                    include: {
                        store: { select: { id: true, name: true, username: true, logo: true } },
                        orderItems: { include: { product: { select: { id: true, name: true, images: true } } } },
                    },
                })
            )
        )

        // Vider le panier persiste (la commande est passee)
        await prisma.user.update({
            where: { id: user.id },
            data: { cart: { total: 0, cartItems: {} } },
        })

        return NextResponse.json({ orders, count: orders.length }, { status: 201 })
    } catch (error) {
        return serverError('ORDERS_POST', error)
    }
}