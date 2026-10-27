import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser, unauthorized, badRequest, serverError } from '@/lib/api-helpers'

const parseStoredCart = (value) => {
    if (!value || typeof value !== 'object') return { total: 0, cartItems: {} }
    return {
        total: typeof value.total === 'number' ? value.total : 0,
        cartItems: value.cartItems && typeof value.cartItems === 'object' ? value.cartItems : {},
    }
}

const isValidCart = (cart) => {
    if (typeof cart.total !== 'number' || cart.total < 0) return false
    if (!cart.cartItems || typeof cart.cartItems !== 'object' || Array.isArray(cart.cartItems)) return false
    return Object.values(cart.cartItems).every((qty) => Number.isInteger(qty) && qty > 0)
}

// GET /api/cart - panier persiste de l'utilisateur connecte
export async function GET() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { cart: true },
        })

        const cart = parseStoredCart(dbUser?.cart)

        return NextResponse.json({ cart })
    } catch (error) {
        return serverError('CART_GET', error)
    }
}

// POST /api/cart - fusionner + sauvegarder le panier (connexion / sync)
export async function POST(request) {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const body = await request.json()
        const clientCart = parseStoredCart(body)

        if (!isValidCart(clientCart)) {
            return badRequest('Panier invalide')
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { cart: true },
        })
        const serverCart = parseStoredCart(dbUser?.cart)

        // Fusion : quantite maximale entre panier serveur et panier local (aucune perte, pas de double compte)
        const mergedCartItems = {}
        const allIds = new Set([...Object.keys(serverCart.cartItems), ...Object.keys(clientCart.cartItems)])
        for (const id of allIds) {
            mergedCartItems[id] = Math.max(serverCart.cartItems[id] || 0, clientCart.cartItems[id] || 0)
        }

        const total = Object.values(mergedCartItems).reduce((sum, qty) => sum + qty, 0)
        const cart = { total, cartItems: mergedCartItems }

        await prisma.user.update({
            where: { id: user.id },
            data: { cart },
        })

        return NextResponse.json({ cart })
    } catch (error) {
        return serverError('CART_POST', error)
    }
}

// DELETE /api/cart - vider le panier persiste de l'utilisateur
export async function DELETE() {
    try {
        const user = await getCurrentUser()
        if (!user) return unauthorized()

        const cart = { total: 0, cartItems: {} }

        await prisma.user.update({
            where: { id: user.id },
            data: { cart },
        })

        return NextResponse.json({ cart })
    } catch (error) {
        return serverError('CART_DELETE', error)
    }
}