import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { productUpdateSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, forbidden, badRequest, serverError } from '@/lib/api-helpers'
import { cached, invalidateCache } from '@/lib/cache'

// GET /api/products/[id] - detail public
export async function GET(request, { params }) {
    try {
        const { id } = await params

        const data = await cached(`product:${id}`, 30, async () => {
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    store: { select: { id: true, name: true, username: true, logo: true, address: true } },
                    rating: {
                        include: { user: { select: { id: true, name: true, image: true } } },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            })

            if (!product) return { error: 'Produit introuvable', status: 404 }

            const ratings = product.rating.map((r) => r.rating)
            const avgRating = ratings.length
                ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                : 0

            return {
                product: { ...product, avgRating, totalRatings: ratings.length },
            }
        })

        if (data.status === 404) {
            return NextResponse.json({ error: data.error }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return serverError('PRODUCT_GET', error)
    }
}

// PATCH /api/products/[id] - modifier (owner ou admin)
export async function PATCH(request, { params }) {
    try {
        const { id } = await params

        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const product = await prisma.product.findUnique({ where: { id }, select: { storeId: true } })
        if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })

        // Verifier propriete : admin OU vendeur proprietaire du store
        if (user.role !== 'ADMIN') {
            if (user.role !== 'SELLER' || user.store?.id !== product.storeId) {
                return forbidden('Vous ne pouvez modifier que vos propres produits')
            }
        }

        const body = await request.json()
        const parsed = productUpdateSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }

        // Coherence prix si les deux fournis
        if (parsed.data.price != null && parsed.data.mrp != null && parsed.data.price > parsed.data.mrp) {
            return badRequest('Le prix de vente ne peut pas depasser le prix barre (MRP)')
        }

        const updated = await prisma.product.update({
            where: { id },
            data: parsed.data,
        })

        invalidateCache(`product:${id}`)
        invalidateCache('products:')

        return NextResponse.json({ product: updated })
    } catch (error) {
        return serverError('PRODUCT_PATCH', error)
    }
}

// DELETE /api/products/[id] - supprimer (owner ou admin)
export async function DELETE(request, { params }) {
    try {
        const { id } = await params

        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const product = await prisma.product.findUnique({ where: { id }, select: { storeId: true } })
        if (!product) return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 })

        if (user.role !== 'ADMIN') {
            if (user.role !== 'SELLER' || user.store?.id !== product.storeId) {
                return forbidden('Vous ne pouvez supprimer que vos propres produits')
            }
        }

        // Verifier que le produit n'est pas dans une commande
        const orderCount = await prisma.orderItem.count({ where: { productId: id } })
        if (orderCount > 0) {
            // Soft delete : marquer hors stock plutot que supprimer
            await prisma.product.update({ where: { id }, data: { inStock: false } })
            invalidateCache(`product:${id}`)
            invalidateCache('products:')
            return NextResponse.json({
                message: 'Produit present dans des commandes : marque hors stock au lieu d\'etre supprime',
                softDeleted: true,
            })
        }

        await prisma.product.delete({ where: { id } })

        invalidateCache(`product:${id}`)
        invalidateCache('products:')

        return NextResponse.json({ message: 'Produit supprime' })
    } catch (error) {
        return serverError('PRODUCT_DELETE', error)
    }
}
