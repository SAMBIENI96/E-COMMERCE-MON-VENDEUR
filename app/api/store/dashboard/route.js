import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, unauthorized, forbidden, serverError } from '@/lib/api-helpers'

// GET /api/store/dashboard - statistiques du vendeur connecte
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        if (!['SELLER', 'ADMIN'].includes(user.role)) {
            return forbidden('Reserve aux vendeurs')
        }

        if (!user.store) {
            return NextResponse.json({
                totalProducts: 0,
                totalEarnings: 0,
                totalOrders: 0,
                ratings: [],
                hasStore: false,
            })
        }

        const storeId = user.store.id

        const [totalProducts, totalOrders, earningsAgg, ratings, recentOrders] =
            await Promise.all([
                prisma.product.count({ where: { storeId } }),
                prisma.order.count({ where: { storeId } }),
                prisma.order.aggregate({
                    where: {
                        storeId,
                        OR: [{ isPaid: true }, { status: 'DELIVERED' }],
                    },
                    _sum: { total: true },
                }),
                prisma.rating.findMany({
                    where: { product: { storeId } },
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: {
                        user: { select: { id: true, name: true, image: true } },
                        product: { select: { id: true, name: true, category: true } },
                    },
                }),
                prisma.order.findMany({
                    where: { storeId },
                    orderBy: { createdAt: 'desc' },
                    take: 100,
                    select: { createdAt: true, total: true, status: true },
                }),
            ])

        return NextResponse.json({
            hasStore: true,
            totalProducts,
            totalEarnings: earningsAgg._sum.total || 0,
            totalOrders,
            ratings,
            recentOrders,
        })
    } catch (error) {
        return serverError('STORE_DASHBOARD', error)
    }
}
