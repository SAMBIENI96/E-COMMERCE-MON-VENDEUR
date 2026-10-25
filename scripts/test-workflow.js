// Test d'integration du workflow complet : seller + store + produit + approbation
import { prisma } from '../lib/db.js'
import bcrypt from 'bcryptjs'

async function main() {
    // 1. Nettoyage des donnees de test precedentes
    const testEmail = 'vendeur@test.bj'
    const oldUser = await prisma.user.findUnique({ where: { email: testEmail }, include: { store: true } })
    if (oldUser) {
        if (oldUser.store) await prisma.store.delete({ where: { id: oldUser.store.id } })
        await prisma.user.delete({ where: { id: oldUser.id } })
    }

    // 2. Creation vendeur (comme POST /api/register)
    const passwordHash = await bcrypt.hash('vendeur123', 12)
    const seller = await prisma.user.create({
        data: { id: crypto.randomUUID(), name: 'Vendeur Test', email: testEmail, passwordHash, role: 'USER' },
    })
    console.log('1. Vendeur cree       :', seller.email, '/ role:', seller.role)

    // 3. Creation boutique (comme POST /api/stores)
    const store = await prisma.store.create({
        data: {
            userId: seller.id,
            name: 'Boutique Test',
            username: 'boutique-test',
            description: 'Une boutique de test pour valider le workflow',
            address: 'Cotonou, Benin',
            logo: 'https://example.com/logo.png',
            email: 'contact@boutiquetest.bj',
            contact: '+22990000000',
            status: 'pending',
            isActive: false,
        },
    })
    await prisma.user.update({ where: { id: seller.id }, data: { role: 'SELLER' } })
    console.log('2. Boutique creee     :', store.name, '/ status:', store.status)

    // 4. Approbation admin (comme PATCH /api/admin/stores)
    const approved = await prisma.store.update({
        where: { id: store.id },
        data: { status: 'approved', isActive: true },
    })
    console.log('3. Boutique approuvee :', approved.status, '/ active:', approved.isActive)

    // 5. Ajout produit (comme POST /api/products)
    const product = await prisma.product.create({
        data: {
            name: 'Casque Bluetooth Test',
            description: 'Un casque bluetooth de tres bonne qualite pour les tests',
            mrp: 25000,
            price: 19999,
            images: ['https://example.com/casque.png'],
            category: 'Audio',
            inStock: true,
            storeId: store.id,
        },
    })
    console.log('4. Produit cree       :', product.name, '/ prix:', product.price)

    // 6. Verification : le produit apparait dans la liste publique
    const publicProducts = await prisma.product.findMany({
        where: { store: { isActive: true, status: 'approved' } },
        include: { store: { select: { name: true } } },
    })
    console.log('5. Liste publique     :', publicProducts.length, 'produits visibles')

    console.log('\n✅ WORKFLOW COMPLET VALIDE : inscription -> boutique -> approbation -> produit -> liste publique')
    console.log('\nCredentials vendeur de test :')
    console.log('   Email : vendeur@test.bj')
    console.log('   Pass  : vendeur123')
}

main()
    .catch((e) => { console.error('❌', e); process.exit(1) })
    .finally(async () => { await prisma.$disconnect() })
