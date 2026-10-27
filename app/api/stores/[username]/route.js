import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { serverError } from '@/lib/api-helpers'
import { cached } from '@/lib/cache'

// GET /api/stores/[username] - profil public d'une boutique approuvee et active
export async function GET(request, { params }) {
    try {
        const { username } = await params

        const data = await cached(`store:${username}`, 30, async () => {
            const store = await prisma.store.findFirst({
                where: { username, status: 'approved', isActive: true },
                select: {
                    id: true,
                    name: true,
                    username: true,
                    description: true,
                    address: true,
                    email: true,
                    contact: true,
                    logo: true,
                    createdAt: true,
                    _count: { select: { Product: true } },
                },
            })

            if (!store) return { error: 'Boutique introuvable', status: 404 }
            return { store }
        })

        if (data.status === 404) {
            return NextResponse.json({ error: data.error }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return serverError('STORE_USERNAME_GET', error)
    }
}