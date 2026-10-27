import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { storeSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, badRequest, serverError } from '@/lib/api-helpers'

// GET /api/stores - ma boutique (session requise)
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        if (!user.store) {
            return NextResponse.json({ store: null })
        }

        const store = await prisma.store.findUnique({
            where: { userId: user.id },
            select: {
                id: true, name: true, username: true, description: true,
                address: true, status: true, isActive: true, logo: true,
                email: true, contact: true, createdAt: true,
                _count: { select: { Product: true, Order: true } },
            },
        })

        return NextResponse.json({ store })
    } catch (error) {
        return serverError('STORE_GET', error)
    }
}

// POST /api/stores - creer une boutique (user connecte, sans store)
export async function POST(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        // Un utilisateur = une boutique
        const existing = await prisma.store.findUnique({ where: { userId: user.id } })
        if (existing) {
            return badRequest('Vous avez deja une boutique')
        }

        const body = await request.json()
        const parsed = storeSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }

        // Username unique
        const usernameTaken = await prisma.store.findUnique({
            where: { username: parsed.data.username },
        })
        if (usernameTaken) {
            return NextResponse.json(
                { error: `Le username "${parsed.data.username}" est deja pris` },
                { status: 409 }
            )
        }

        const store = await prisma.store.create({
            data: {
                ...parsed.data,
                userId: user.id,
                status: 'pending', // en attente d'approbation admin
                isActive: false,
            },
        })

        // Promouvoir l'utilisateur en SELLER
        await prisma.user.update({
            where: { id: user.id },
            data: { role: 'SELLER' },
        })

        return NextResponse.json({ store }, { status: 201 })
    } catch (error) {
        return serverError('STORE_POST', error)
    }
}
