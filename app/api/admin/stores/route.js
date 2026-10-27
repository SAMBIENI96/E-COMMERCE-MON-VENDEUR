import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, unauthorized, forbidden, badRequest, serverError } from '@/lib/api-helpers'
import { invalidateCache } from '@/lib/cache'

// GET /api/admin/stores - liste des boutiques (ADMIN)
export async function GET(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()
        if (user.role !== 'ADMIN') return forbidden('Reserve aux administrateurs')

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')?.trim() || ''
        const search = searchParams.get('search')?.trim() || ''

        const where = {}
        if (status) where.status = status
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ]
        }

        const stores = await prisma.store.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, name: true, email: true, image: true } },
                _count: { select: { Product: true, Order: true } },
            },
        })

        return NextResponse.json({ stores })
    } catch (error) {
        return serverError('ADMIN_STORES_GET', error)
    }
}

// PATCH /api/admin/stores - approuver / rejeter / activer (ADMIN)
export async function PATCH(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()
        if (user.role !== 'ADMIN') return forbidden('Reserve aux administrateurs')

        const body = await request.json()
        const { storeId, status, isActive } = body

        if (!storeId) return badRequest('storeId requis')

        // status : pending | approved | rejected
        const validStatus = ['pending', 'approved', 'rejected']
        if (status && !validStatus.includes(status)) {
            return badRequest('Statut invalide (pending, approved ou rejected)')
        }

        const data = {}
        if (status) {
            data.status = status
            // Une boutique approuvee devient active automatiquement
            data.isActive = status === 'approved'
        }
        if (typeof isActive === 'boolean') data.isActive = isActive

        if (Object.keys(data).length === 0) {
            return badRequest('Rien a mettre a jour')
        }

        const store = await prisma.store.update({
            where: { id: storeId },
            data,
            include: {
                user: { select: { id: true, name: true, email: true } },
                _count: { select: { Product: true, Order: true } },
            },
        })

        // Le statut/activation de la boutique conditionne la liste publique des produits
        invalidateCache('store:')
        invalidateCache('products:')

        return NextResponse.json({ store })
    } catch (error) {
        return serverError('ADMIN_STORES_PATCH', error)
    }
}
