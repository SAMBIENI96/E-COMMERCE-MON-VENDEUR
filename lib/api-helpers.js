import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

/**
 * Recupere la session et l'utilisateur complet depuis la DB.
 * Retourne null si non connecte.
 */
export async function getCurrentUser() {
    const session = await auth()
    if (!session?.user?.id) return null

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            store: {
                select: { id: true, name: true, username: true, status: true, isActive: true },
            },
        },
    })
    return user
}

/**
 * Reponses d'erreur normalisees
 */
export function unauthorized() {
    return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
}

export function forbidden(message = 'Acces refuse') {
    return NextResponse.json({ error: message }, { status: 403 })
}

export function badRequest(message = 'Donnees invalides') {
    return NextResponse.json({ error: message }, { status: 400 })
}

export function serverError(prefix = 'Erreur', error) {
    console.error(`[${prefix}]`, error?.message)
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 })
}
