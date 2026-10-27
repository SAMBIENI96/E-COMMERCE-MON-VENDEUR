import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addressSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, forbidden, badRequest, serverError } from '@/lib/api-helpers'

// PATCH /api/addresses/[id] - modifier une adresse
export async function PATCH(request, { params }) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const { id } = await params

        const existing = await prisma.address.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: 'Adresse introuvable' }, { status: 404 })
        }
        if (existing.userId !== user.id) return forbidden()

        const body = await request.json()
        const parsed = addressSchema.partial().safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }

        const address = await prisma.address.update({
            where: { id },
            data: parsed.data,
        })

        return NextResponse.json({ address })
    } catch (error) {
        return serverError('ADDRESS_PATCH', error)
    }
}

// DELETE /api/addresses/[id] - supprimer une adresse
export async function DELETE(request, { params }) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const { id } = await params

        const existing = await prisma.address.findUnique({ where: { id } })
        if (!existing) {
            return NextResponse.json({ error: 'Adresse introuvable' }, { status: 404 })
        }
        if (existing.userId !== user.id) return forbidden()

        // Une adresse liee a une commande ne peut pas etre supprimee
        const orderCount = await prisma.order.count({ where: { addressId: id } })
        if (orderCount > 0) {
            return badRequest('Cette adresse est liee a une commande existante')
        }

        await prisma.address.delete({ where: { id } })

        return NextResponse.json({ message: 'Adresse supprimee' })
    } catch (error) {
        return serverError('ADDRESS_DELETE', error)
    }
}