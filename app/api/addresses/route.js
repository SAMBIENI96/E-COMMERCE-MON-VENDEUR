import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { addressSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, badRequest, serverError } from '@/lib/api-helpers'

// GET /api/addresses - adresses de l'utilisateur connecte
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const addresses = await prisma.address.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ addresses })
    } catch (error) {
        return serverError('ADDRESSES_GET', error)
    }
}

// POST /api/addresses - creer une adresse
export async function POST(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const body = await request.json()
        const parsed = addressSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }

        const address = await prisma.address.create({
            data: { ...parsed.data, userId: user.id },
        })

        return NextResponse.json({ address }, { status: 201 })
    } catch (error) {
        return serverError('ADDRESSES_POST', error)
    }
}