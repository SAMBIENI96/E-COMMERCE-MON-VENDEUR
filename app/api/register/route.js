import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const registerSchema = z.object({
    name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(50),
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court (min 6 caractères)').max(100),
})

export async function POST(request) {
    try {
        const body = await request.json()

        const parsed = registerSchema.safeParse(body)
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || 'Données invalides' },
                { status: 400 }
            )
        }

        const { name, email, password } = parsed.data

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json(
                { error: 'Un compte existe déjà avec cet email' },
                { status: 409 }
            )
        }

        // Hacher le mot de passe
        const passwordHash = await bcrypt.hash(password, 12)

        const user = await prisma.user.create({
            data: {
                id: crypto.randomUUID(),
                name,
                email,
                passwordHash,
                role: 'USER',
            },
            select: { id: true, name: true, email: true, role: true },
        })

        return NextResponse.json({ user }, { status: 201 })
    } catch (error) {
        console.error('[REGISTER] Erreur:', error?.message)
        return NextResponse.json(
            { error: 'Erreur interne du serveur' },
            { status: 500 }
        )
    }
}
