// Script de seed : cree un utilisateur admin de test
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node --env-file=.env scripts/seed-admin.js
import { prisma } from '../lib/db.js'
import bcrypt from 'bcryptjs'

async function main() {
    const email = process.env.ADMIN_EMAIL
    const password = process.env.ADMIN_PASSWORD
    const name = process.env.ADMIN_NAME || 'Admin Go-shop'

    if (!email || !password) {
        console.error('❌ ADMIN_EMAIL et ADMIN_PASSWORD sont requis (variables d\'environnement).')
        process.exit(1)
    }
    if (password.length < 8) {
        console.error('❌ ADMIN_PASSWORD doit contenir au moins 8 caracteres.')
        process.exit(1)
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'ADMIN', passwordHash },
        create: {
            id: crypto.randomUUID(),
            email,
            name,
            passwordHash,
            role: 'ADMIN',
        },
    })

    console.log('✅ Admin cree/mis a jour :')
    console.log('   Email    :', user.email)
    console.log('   Role     :', user.role)
    console.log('\n⚠️  Ne commitez jamais ADMIN_PASSWORD. Utilisez un gestionnaire de secrets.')
}

main()
    .catch((e) => {
        console.error('❌ Erreur:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
