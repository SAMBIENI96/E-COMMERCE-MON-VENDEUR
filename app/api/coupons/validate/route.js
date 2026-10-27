import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, badRequest, serverError } from '@/lib/api-helpers'

// POST /api/coupons/validate - verification publique d'un code promo
export async function POST(request) {
    try {
        const body = await request.json()
        const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : ''

        if (!code) return badRequest('Code promo requis')

        const coupon = await prisma.coupon.findUnique({ where: { code } })
        if (!coupon) {
            return NextResponse.json({ error: 'Code promo introuvable' }, { status: 404 })
        }

        if (coupon.expiresAt < new Date()) {
            return badRequest('Ce code promo a expire')
        }

        const user = await getCurrentUser()

        if (coupon.forMember && !user) {
            return badRequest('Ce code est reserve aux membres connectes')
        }

        if (coupon.forNewUser) {
            if (!user) {
                return badRequest('Ce code est reserve aux nouveaux clients')
            }
            const orderCount = await prisma.order.count({ where: { userId: user.id } })
            if (orderCount > 0) {
                return badRequest('Ce code est reserve aux nouveaux clients')
            }
        }

        return NextResponse.json({
            coupon: {
                code: coupon.code,
                description: coupon.description,
                discount: coupon.discount,
            },
        })
    } catch (error) {
        return serverError('COUPON_VALIDATE', error)
    }
}