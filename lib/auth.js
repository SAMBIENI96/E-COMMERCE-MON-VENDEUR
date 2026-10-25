import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const loginSchema = z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(6, 'Mot de passe trop court (min 6 caractères)'),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        // JWT : fonctionne avec le provider Credentials,
        // pas besoin des sessions en DB
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 jours
    },

    providers: [
        Credentials({
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Mot de passe', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const parsed = loginSchema.safeParse(credentials)
                    if (!parsed.success) return null

                    const { email, password } = parsed.data

                    const user = await prisma.user.findUnique({ where: { email } })

                    if (!user || !user.passwordHash) return null

                    const isValid = await bcrypt.compare(password, user.passwordHash)
                    if (!isValid) return null

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role,
                    }
                } catch (error) {
                    console.error('[AUTH] Erreur authorize:', error?.message)
                    return null
                }
            },
        }),
    ],

    callbacks: {
        // Contrôle d'accès par route (utilisé par le middleware)
        authorized({ request, auth }) {
            const { pathname } = request.nextUrl

            // Routes admin : rôle ADMIN uniquement
            if (pathname.startsWith('/admin')) {
                return auth?.user?.role === 'ADMIN'
            }

            // Routes vendeur : rôle SELLER ou ADMIN
            if (pathname.startsWith('/store')) {
                return auth?.user?.role === 'SELLER' || auth?.user?.role === 'ADMIN'
            }

            // Autres routes protégées : simple connexion requise
            return !!auth?.user
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session
        },
    },
})
