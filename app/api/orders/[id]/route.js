import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, unauthorized, forbidden, serverError } from '@/lib/api-helpers'

// GET /api/orders/[id] - detail (acheteur, vendeur de la boutique ou admin)
export async function GET(request, { params }) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const { id } = await params

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true, email: true } },
                store: { select: { id: true, name: true, username: true, logo: true, userId: true } },
                address: true,
                orderItems: {
                    include: { product: { select: { id: true, name: true, images: true, price: true } } },
                },
            },
        })

        if (!order) {
            return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
        }

        const isOwner = order.userId === user.id
        const isSeller = order.store.userId === user.id
        const isAdmin = user.role === 'ADMIN'

        if (!isOwner && !isSeller && !isAdmin) return forbidden()

        return NextResponse.json({ order })
    } catch (error) {
        return serverError('ORDER_GET', error)
    }
}