import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ratingSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, badRequest, serverError } from '@/lib/api-helpers'
import { invalidateCache } from '@/lib/cache'

// GET /api/ratings?productId=xxx  -> avis d'un produit (public)
// GET /api/ratings                -> avis de l'utilisateur connecte
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')

        if (productId) {
            const ratings = await prisma.rating.findMany({
                where: { productId },
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { id: true, name: true, image: true } } },
            })
            return NextResponse.json({ ratings })
        }

        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const ratings = await prisma.rating.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ ratings })
    } catch (error) {
        return serverError('RATINGS_GET', error)
    }
}

// POST /api/ratings - noter un produit achete (commande DELIVERED uniquement)
export async function POST(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const body = await request.json()
        const parsed = ratingSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }
        const { productId, orderId, rating, review } = parsed.data

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { orderItems: { select: { productId: true } } },
        })
        if (!order || order.userId !== user.id) {
            return badRequest('Commande introuvable')
        }
        if (order.status !== 'DELIVERED') {
            return badRequest('Vous pourrez noter ce produit une fois la commande livree')
        }
        if (!order.orderItems.some((i) => i.productId === productId)) {
            return badRequest('Ce produit ne fait pas partie de la commande')
        }

        const saved = await prisma.rating.upsert({
            where: {
                userId_productId_orderId: { userId: user.id, productId, orderId },
            },
            update: { rating, review },
            create: { userId: user.id, productId, orderId, rating, review },
        })

        invalidateCache(`product:${productId}`)
        invalidateCache('products:')

        return NextResponse.json({ rating: saved }, { status: 201 })
    } catch (error) {
        return serverError('RATINGS_POST', error)
    }
}