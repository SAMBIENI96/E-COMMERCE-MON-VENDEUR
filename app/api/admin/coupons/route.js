import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { couponSchema } from '@/lib/validations/schemas'
import { getCurrentUser, unauthorized, forbidden, badRequest, serverError } from '@/lib/api-helpers'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user) return unauthorized()
    if (user.role !== 'ADMIN') return forbidden('Reserve aux administrateurs')
    return null
}

// GET /api/admin/coupons - liste des codes promo (ADMIN)
export async function GET() {
    try {
        const denied = await requireAdmin()
        if (denied) return denied

        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ coupons })
    } catch (error) {
        return serverError('ADMIN_COUPONS_GET', error)
    }
}

// POST /api/admin/coupons - creer un code promo (ADMIN)
export async function POST(request) {
    try {
        const denied = await requireAdmin()
        if (denied) return denied

        const body = await request.json()
        const parsed = couponSchema.safeParse(body)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }

        const existing = await prisma.coupon.findUnique({
            where: { code: parsed.data.code },
        })
        if (existing) return badRequest('Ce code promo existe deja')

        const coupon = await prisma.coupon.create({ data: parsed.data })

        return NextResponse.json({ coupon }, { status: 201 })
    } catch (error) {
        return serverError('ADMIN_COUPONS_POST', error)
    }
}

// PATCH /api/admin/coupons - modifier un code promo (ADMIN)
export async function PATCH(request) {
    try {
        const denied = await requireAdmin()
        if (denied) return denied

        const body = await request.json()
        const { code, ...fields } = body

        if (!code) return badRequest('code requis')

        const parsed = couponSchema.partial().safeParse(fields)
        if (!parsed.success) {
            return badRequest(parsed.error.issues[0]?.message || 'Donnees invalides')
        }

        const existing = await prisma.coupon.findUnique({
            where: { code: String(code).toUpperCase() },
        })
        if (!existing) return NextResponse.json({ error: 'Code promo introuvable' }, { status: 404 })

        const coupon = await prisma.coupon.update({
            where: { code: existing.code },
            data: parsed.data,
        })

        return NextResponse.json({ coupon })
    } catch (error) {
        return serverError('ADMIN_COUPONS_PATCH', error)
    }
}

// DELETE /api/admin/coupons?code=XXX - supprimer un code promo (ADMIN)
export async function DELETE(request) {
    try {
        const denied = await requireAdmin()
        if (denied) return denied

        const code = new URL(request.url).searchParams.get('code')?.trim().toUpperCase()
        if (!code) return badRequest('code requis')

        const existing = await prisma.coupon.findUnique({ where: { code } })
        if (!existing) return NextResponse.json({ error: 'Code promo introuvable' }, { status: 404 })

        await prisma.coupon.delete({ where: { code } })

        return NextResponse.json({ message: 'Code promo supprime' })
    } catch (error) {
        return serverError('ADMIN_COUPONS_DELETE', error)
    }
}
