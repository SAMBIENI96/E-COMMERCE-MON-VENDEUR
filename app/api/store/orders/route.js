import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, unauthorized, serverError } from '@/lib/api-helpers'

// GET /api/store/orders - commandes de la boutique du vendeur connecte
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        if (!user.store) {
            return NextResponse.json({ orders: [] })
        }

        const orders = await prisma.order.findMany({
            where: { storeId: user.store.id },
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true } },
                address: true,
                orderItems: {
                    include: { product: { select: { id: true, name: true, images: true, price: true } } },
                },
            },
        })

        return NextResponse.json({ orders })
    } catch (error) {
        return serverError('STORE_ORDERS_GET', error)
    }
}