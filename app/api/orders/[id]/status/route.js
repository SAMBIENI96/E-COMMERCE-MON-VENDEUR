import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { orderStatusSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, forbidden, badRequest, serverError } from '@/lib/api-helpers'

// PATCH /api/orders/[id]/status - mise a jour du statut (vendeur de la boutique ou admin)
export async function PATCH(request, { params }) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const { id } = await params

        const body = await request.json()
        const parsed = orderStatusSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Statut invalide')
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: { store: { select: { userId: true } } },
        })
        if (!order) {
            return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
        }

        const isSeller = order.store.userId === user.id
        const isAdmin = user.role === 'ADMIN'
        if (!isSeller && !isAdmin) return forbidden()

        const updated = await prisma.order.update({
            where: { id },
            data: { status: parsed.data.status },
        })

        return NextResponse.json({ order: updated })
    } catch (error) {
        return serverError('ORDER_STATUS_PATCH', error)
    }
}