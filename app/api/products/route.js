import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { productSchema } from '@/lib/validations/schemas'
import { getCurrentUser, forbidden, badRequest, serverError } from '@/lib/api-helpers'
import { cached, invalidateCache } from '@/lib/cache'

// GET /api/products - liste publique avec filtres + pagination
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)

        const search = searchParams.get('search')?.trim() || ''
        const category = searchParams.get('category')?.trim() || ''
        const storeId = searchParams.get('storeId')?.trim() || ''
        const storeUsername = searchParams.get('store')?.trim() || ''
        const sort = searchParams.get('sort') || 'recent'
        const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1)
        const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10) || 12))

        const key = `products:${[search, category, storeId, storeUsername, sort, page, limit].join('|')}`

        const data = await cached(key, 30, async () => {
            const where = {
                // Ne montrer que les produits des boutiques approuvees/actives
                store: { isActive: true, status: 'approved' },
            }

            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ]
            }
            if (category) where.category = category
            if (storeId) where.storeId = storeId
            if (storeUsername) where.store = { ...where.store, username: storeUsername }

            const orderBy = {
                recent: { createdAt: 'desc' },
                'price-asc': { price: 'asc' },
                'price-desc': { price: 'desc' },
            }[sort] || { createdAt: 'desc' }

            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    orderBy,
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        store: { select: { id: true, name: true, username: true, logo: true } },
                        rating: { select: { rating: true } },
                    },
                }),
                prisma.product.count({ where }),
            ])

            // Calcul de la note moyenne par produit
            const productsWithAvg = products.map((p) => {
                const ratings = p.rating.map((r) => r.rating)
                const avgRating = ratings.length
                    ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                    : 0
                const { rating, ...rest } = p
                return { ...rest, avgRating, totalRatings: ratings.length }
            })

            return {
                products: productsWithAvg,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            }
        })

        return NextResponse.json(data)
    } catch (error) {
        return serverError('PRODUCTS_GET', error)
    }
}

// POST /api/products - creer un produit (SELLER avec store approuve)
export async function POST(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return forbidden('Connectez-vous pour ajouter un produit')

        if (!['SELLER', 'ADMIN'].includes(user.role)) {
            return forbidden('Role insuffisant pour creer un produit')
        }

        if (!user.store) return badRequest('Vous devez avoir une boutique. Creez-en une d\'abord.')
        if (user.store.status !== 'approved') {
            return badRequest('Votre boutique doit etre approuvee par un administrateur avant d\'ajouter des produits')
        }

        const body = await request.json()
        const parsed = productSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }

        if (parsed.data.price > parsed.data.mrp) {
            return badRequest('Le prix de vente ne peut pas depasser le prix barre (MRP)')
        }

        const product = await prisma.product.create({
            data: { ...parsed.data, storeId: user.store.id },
            include: {
                store: { select: { id: true, name: true, username: true, logo: true } },
            },
        })

        invalidateCache('products:')

        return NextResponse.json({ product }, { status: 201 })
    } catch (error) {
        return serverError('PRODUCTS_POST', error)
    }
}
