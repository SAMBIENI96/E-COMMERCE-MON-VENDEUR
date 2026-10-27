import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, unauthorized, forbidden, serverError } from '@/lib/api-helpers'

// GET /api/store/products - produits de la boutique du vendeur connecte
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        if (!['SELLER', 'ADMIN'].includes(user.role)) {
            return forbidden('Reserve aux vendeurs')
        }

        if (!user.store) {
            return NextResponse.json({ products: [] })
        }

        const products = await prisma.product.findMany({
            where: { storeId: user.store.id },
            orderBy: { createdAt: 'desc' },
            include: { rating: { select: { rating: true } } },
        })

        const productsWithAvg = products.map((p) => {
            const ratings = p.rating.map((r) => r.rating)
            const avgRating = ratings.length
                ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                : 0
            const { rating, ...rest } = p
            return { ...rest, avgRating, totalRatings: ratings.length }
        })

        return NextResponse.json({ products: productsWithAvg })
    } catch (error) {
        return serverError('STORE_PRODUCTS_GET', error)
    }
}
