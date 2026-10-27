import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, unauthorized, forbidden, serverError } from '@/lib/api-helpers'

// GET /api/admin/dashboard - statistiques globales (ADMIN)
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()
        if (user.role !== 'ADMIN') return forbidden('Reserve aux administrateurs')

        const [products, orders, stores, pendingStores, revenueAgg, recentOrders] =
            await Promise.all([
                prisma.product.count(),
                prisma.order.count(),
                prisma.store.count({ where: { status: 'approved' } }),
                prisma.store.count({ where: { status: 'pending' } }),
                // Chiffre d'affaires : uniquement commandes payees (COD livre ou Stripe)
                prisma.order.aggregate({
                    where: { OR: [{ isPaid: true }, { status: 'DELIVERED' }] },
                    _sum: { total: true },
                }),
                prisma.order.findMany({
                    orderBy: { createdAt: 'desc' },
                    take: 100,
                    select: { createdAt: true, total: true, status: true },
                }),
            ])

        return NextResponse.json({
            products,
            orders,
            stores,
            pendingStores,
            revenue: revenueAgg._sum.total || 0,
            allOrders: recentOrders,
        })
    } catch (error) {
        return serverError('ADMIN_DASHBOARD', error)
    }
}
