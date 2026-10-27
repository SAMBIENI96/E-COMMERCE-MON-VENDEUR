// Test d'integration HTTP du parcours d'achat (COD) : connexion -> adresse -> commande -> statut -> avis
// Usage : BASE=http://localhost:3199 node scripts/test-orders.js
import { prisma } from '../lib/db.js'
import bcrypt from 'bcryptjs'

const BASE = process.env.BASE || 'http://localhost:3199'
const jar = new Map()

const saveCookies = (res) => {
    const cookies = res.headers.getSetCookie ? res.headers.getSetCookie() : []
    for (const c of cookies) {
        const pair = c.split(';')[0]
        const idx = pair.indexOf('=')
        if (idx > 0) jar.set(pair.slice(0, idx), pair.slice(idx + 1))
    }
    if (cookies.length === 0) {
        const raw = res.headers.get('set-cookie')
        if (raw) {
            const pair = raw.split(';')[0]
            const idx = pair.indexOf('=')
            if (idx > 0) jar.set(pair.slice(0, idx), pair.slice(idx + 1))
        }
    }
}

const cookieHeader = () => [...jar.entries()].map(([k, v]) => `${k}=${v}`).join('; ')

async function req(path, options = {}) {
    const res = await fetch(BASE + path, {
        ...options,
        redirect: 'manual',
        headers: { ...(options.headers || {}), cookie: cookieHeader() },
    })
    saveCookies(res)
    return res
}

async function login(email, password) {
    jar.clear()
    const csrfRes = await req('/api/auth/csrf')
    const { csrfToken } = await csrfRes.json()

    const body = new URLSearchParams({ csrfToken, email, password, callbackUrl: BASE + '/' })
    await req('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    })

    const sessionRes = await req('/api/auth/session')
    const session = await sessionRes.json()
    return session?.user || null
}

const json = async (res) => {
    const text = await res.text()
    try { return JSON.parse(text) } catch { return text }
}

let passed = 0
let failed = 0
function check(label, condition, extra = '') {
    if (condition) { passed++; console.log(`  OK   ${label}`) }
    else { failed++; console.log(`  FAIL ${label} ${extra}`) }
}

async function main() {
    const email = 'acheteur@test.bj'
    const password = 'acheteur123'

    // Nettoyage des donnees de test precedentes
    const old = await prisma.user.findUnique({ where: { email } })
    if (old) {
        await prisma.rating.deleteMany({ where: { userId: old.id } })
        await prisma.order.deleteMany({ where: { userId: old.id } })
        await prisma.address.deleteMany({ where: { userId: old.id } })
        await prisma.user.delete({ where: { id: old.id } })
    }

    const user = await prisma.user.create({
        data: { id: crypto.randomUUID(), name: 'Acheteur Test', email, passwordHash: await bcrypt.hash(password, 12), role: 'USER' },
    })

    console.log('\n1) Connexion acheteur')
    const session = await login(email, password)
    check('session acheteur ouverte', session?.email === email, JSON.stringify(session))

    console.log('\n2) Adresses')
    let res = await req('/api/addresses')
    let data = await json(res)
    check('GET /api/addresses -> 200 []', res.status === 200 && Array.isArray(data.addresses) && data.addresses.length === 0)

    res = await req('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Acheteur Test', email, street: 'Rue 12', city: 'Cotonou', state: 'Littoral', zip: '229', country: 'Benin', phone: '+22990000000' }),
    })
    data = await json(res)
    check('POST /api/addresses -> 201', res.status === 201 && !!data.address?.id, JSON.stringify(data))
    const addressId = data.address?.id

    res = await req('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'X', email: 'pas-un-email', street: 'a', city: 'b', state: 'c', zip: 'd', country: 'e', phone: 'f' }),
    })
    check('POST adresse invalide -> 400', res.status === 400)

    console.log('\n3) Produits')
    res = await req('/api/products?limit=50')
    data = await json(res)
    const product = data.products?.[0]
    check('GET /api/products -> 200 avec produits', res.status === 200 && !!product, JSON.stringify(data).slice(0, 120))
    if (!product) throw new Error('Aucun produit en base : lancez scripts/test-workflow.js')

    console.log('\n4) Coupons')
    res = await req('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'INEXISTANT-XYZ' }),
    })
    check('coupon inconnu -> 404', res.status === 404)

    const testCoupon = 'TESTPROMO10'
    await prisma.coupon.upsert({
        where: { code: testCoupon },
        update: { expiresAt: new Date(Date.now() + 86400000) },
        create: { code: testCoupon, description: 'Coupon de test', discount: 10, forNewUser: false, forMember: false, isPublic: true, expiresAt: new Date(Date.now() + 86400000) },
    })
    res = await req('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: testCoupon }),
    })
    data = await json(res)
    check('coupon valide -> 200 (10%)', res.status === 200 && data.coupon?.discount === 10, JSON.stringify(data))

    console.log('\n5) Commande (COD)')
    res = await req('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId, paymentMethod: 'COD', couponCode: testCoupon, items: [{ productId: product.id, quantity: 2 }] }),
    })
    data = await json(res)
    check('POST /api/orders -> 201', res.status === 201 && data.orders?.length === 1, JSON.stringify(data).slice(0, 200))
    const order = data.orders?.[0]
    if (order) {
        const expected = Math.round((product.price * 2 - 0.1 * product.price * 2) * 100) / 100
        check('total remise appliquee', Math.abs(order.total - expected) < 0.01, `attendu ${expected} recu ${order.total}`)
        check('isCouponUsed', order.isCouponUsed === true)
    }

    res = await req('/api/orders')
    data = await json(res)
    check('GET /api/orders -> contient la commande', res.status === 200 && data.orders?.length === 1)
    const orderId = data.orders?.[0]?.id

    res = await req(`/api/orders/${orderId}`)
    check('GET /api/orders/[id] -> 200', res.status === 200)

    console.log('\n6) Autorisation statut')
    res = await req(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DELIVERED' }),
    })
    check('acheteur ne peut PAS changer le statut -> 403', res.status === 403, `recu ${res.status}`)

    res = await req('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, orderId, rating: 5, review: 'Tres bon produit, je recommande' }),
    })
    check('avis refuse tant que non livree -> 400', res.status === 400)

    // Le vendeur de la boutique change le statut
    const store = await prisma.store.findUnique({ where: { id: product.store.id }, include: { user: true } })
    const sellerSession = store ? await login(store.user.email, 'vendeur123') : null

    if (sellerSession) {
        console.log(`   (connecte en vendeur : ${store.user.email})`)
        res = await req('/api/store/orders')
        data = await json(res)
        check('GET /api/store/orders -> contient la commande', res.status === 200 && data.orders?.some(o => o.id === orderId))

        res = await req(`/api/orders/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'DELIVERED' }),
        })
        data = await json(res)
        check('vendeur change le statut -> 200 DELIVERED', res.status === 200 && data.order?.status === 'DELIVERED', JSON.stringify(data).slice(0, 120))
    } else {
        console.log('   (vendeur de test indisponible : statut via admin/prisma)')
        await prisma.order.update({ where: { id: orderId }, data: { status: 'DELIVERED' } })
    }

    console.log('\n7) Avis apres livraison')
    // re-login acheteur si on a switche de session
    await login(email, password)
    res = await req('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, orderId, rating: 5, review: 'Tres bon produit, je recommande' }),
    })
    data = await json(res)
    check('POST /api/ratings -> 201', res.status === 201 && data.rating?.rating === 5, JSON.stringify(data).slice(0, 160))

    res = await req(`/api/ratings?productId=${product.id}`)
    data = await json(res)
    check('GET /api/ratings?productId -> contient l\'avis', res.status === 200 && data.ratings?.some(r => r.productId === product.id))

    console.log('\n8) Nettoyage')
    await prisma.rating.deleteMany({ where: { userId: user.id } })
    await prisma.order.deleteMany({ where: { userId: user.id } })
    await prisma.address.deleteMany({ where: { userId: user.id } })
    await prisma.user.delete({ where: { id: user.id } })
    await prisma.coupon.deleteMany({ where: { code: testCoupon } })
    console.log('  OK   donnees de test supprimees')

    console.log(`\n=== ${passed} OK / ${failed} FAIL ===`)
    if (failed > 0) process.exitCode = 1
}

main()
    .catch((e) => { console.error('❌', e); process.exitCode = 1 })
    .finally(async () => { await prisma.$disconnect() })
