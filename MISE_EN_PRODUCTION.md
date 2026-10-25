# 🚀 MISE EN PRODUCTION — Ce qui reste à faire

> État audité le 10/10/2026. Ce document liste **uniquement ce qui manque encore**, avec les fichiers exacts à créer/modifier.
> Le détail de l'avancement se trouve dans `PRODUCTION_ROADMAP.md`.

---

## ✅ Ce qui est DÉJÀ fait

- **Auth complète** : NextAuth v5 (credentials + bcrypt), JWT 30j, rôles USER/SELLER/ADMIN, `middleware.js` protège `/admin`, `/store`, `/orders`, `/checkout`, `/create-store`. Déconnexion fonctionnelle dans `components/Navbar.jsx`.
- **APIs réelles et sécurisées** (zod + `lib/api-helpers.js`) : `products` (GET/POST/PATCH/DELETE), `stores` (GET/POST), `admin/dashboard`, `admin/stores`, `admin/coupons`, `store/dashboard`, `store/products`, `register`.
- **Dashboards connectés** : `app/admin/page.jsx`, `app/store/page.jsx`.
- **Back-office admin** : boutiques (liste + approuver/rejeter + filtres + activation), coupons (CRUD complet), page `admin/approve`.
- **Espace vendeur** : add-product, manage-product (grille + édition + suppression + stock), dashboard.
- **Validation zod** sur produits/boutiques/coupons/inscription.
- **Parcours d'achat COD de bout en bout** (étape 3→6) : APIs `addresses`, `orders`, `orders/[id]`, `orders/[id]/status`, `store/orders`, `ratings`, `coupons/validate` ; page `/checkout` + `OrderSummary` (adresse, coupon, paiement) ; pages commandes acheteur/vendeur ; avis produits ; layout vendeur réel (`GET /api/stores`) ; plus aucune donnée factice dans `app/` ni `components/`. Test d'intégration HTTP : `scripts/test-orders.js` (**18/18 OK**).

---

## 🔴 P0 — BLOQUANTS : le site ne vend pas encore rien

Sans ces items, **aucun achat possible**. C'est le chemin critique.

### 1. Le storefront affiche encore des données factices
Toute la vitrine lit `productDummyData` dans Redux au lieu des APIs produits **déjà prêtes** (~ fait) :

- [x] `lib/features/product/productSlice.js` — initialisé avec `productDummyData`, l'action `setProduct` n'est jamais dispatchée → le remplir via `GET /api/products` (au minimum dans `app/(public)/page.jsx`, `app/(public)/shop/page.jsx`)
- [x] `app/(public)/product/[productId]/page.jsx` — cherche le produit dans la liste dummy → `undefined` → **fiche produit vide**. Faire `fetch('/api/products/' + productId)`
- [x] `app/(public)/shop/[username]/page.jsx` — `setStoreInfo(dummyStoreData)` → brancher sur `GET /api/products?store=...` (+ API `app/api/stores/[username]/route.js` créée)
- [x] `components/ProductCard.jsx:12`, `components/ProductDescription.jsx:28`, `components/BestSelling.jsx:15` — lisent `product.rating.length` alors que `/api/products` renvoie `avgRating`/`totalRatings` (**crash garanti** dès le branchement) → adapter ces 3 composants
- [x] Ajouter un vrai bouton « Ajouter au panier » sur `components/ProductCard.jsx`

### 2. Panier non persisté
- [x] `lib/features/cart/cartSlice.js` — logique OK mais **zéro persistance** (aucun `localStorage`, pas de `redux-persist`) → persister en `localStorage` pour les invités
- [x] Sync panier vers la colonne `User.cart` (déjà dans le schema Prisma, jamais lue/écrite) à la connexion + API `app/api/cart/route.js` (GET/POST/DELETE)
- [x] `middleware.js` — `/cart` n'est **pas** dans le matcher alors que la roadmap l'exige → l'ajouter ; `/checkout` est matché alors que la page n'existe pas (voir §3)

### 3. Checkout : la page n'existe pas
- [x] Créer `app/(public)/checkout/page.jsx` (adresse + récap + frais livraison + choix paiement)
- [x] `components/OrderSummary.jsx` — **stub total** : `handleCouponCode` vide, `handlePlaceOrder` fait juste `router.push('/orders')`, props `items` ignorées, `paymentMethod` jamais utilisé
- [x] `components/AddressModal.jsx` — `handleSubmit` ferme le modal **sans sauvegarder** l'adresse (perdue à chaque fermeture)

### 4. APIs manquantes (chemins exacts)

```
[x] app/api/orders/route.js                 GET (mes commandes) | POST (créer la commande — 1 commande par boutique)
[x] app/api/orders/[id]/route.js            GET détail (acheteur | vendeur | admin)
[x] app/api/orders/[id]/status/route.js     PATCH (vendeur/admin : ORDER_PLACED → PROCESSING → SHIPPED → DELIVERED)
[x] app/api/addresses/route.js              GET | POST
[x] app/api/addresses/[id]/route.js         PATCH | DELETE
[x] app/api/ratings/route.js                GET ?productId= | POST (commande DELIVERED uniquement)
[x] app/api/coupons/validate/route.js       POST (vérification publique d'un code — consommé par OrderSummary)
[x] app/api/stores/[username]/route.js      GET (profil public boutique pour /shop/[username])
[x] app/api/cart/route.js                   GET | POST | DELETE (voir §2)
[x] app/api/store/orders/route.js           GET (commandes de la boutique du vendeur)
```

+ schemas zod associés dans `lib/validations/schemas.js` : `orderSchema`, `addressSchema`, `ratingSchema`, `orderStatusSchema` (ajoutés).

### 5. Pages commandes encore dummy
- [x] `app/(public)/orders/page.jsx` — `orderDummyData` → `fetch('/api/orders')` (+ chargement des avis)
- [x] `app/store/orders/page.jsx` — `fetchOrders` simulé, `updateOrderStatus()` **sans corps** → `PATCH /api/orders/[id]/status`
- [x] `components/RatingModal.jsx` — valide puis ferme sans rien sauvegarder → `POST /api/ratings`
- [x] `lib/features/address/addressSlice.js` — seed `addressDummyData`, action `addAddress` jamais dispatchée
- [x] `lib/features/rating/ratingSlice.js` — action `addRating` jamais dispatchée

### 6. Layout vendeur factice
- [x] `components/store/StoreLayout.jsx` — `fetchIsSeller()` force `setIsSeller(true)` et `setStoreInfo(dummyStoreData)` → appeler `GET /api/stores` (route existante)
- [x] `components/store/StoreNavbar.jsx` — « Bonjour, vendeur » statique : nom réel + déconnexion

---

## 🟠 P1 — PAIEMENT & CONFIANCE

### 7. Stripe (aujourd'hui : radio bouton cosmétique uniquement)
- [ ] `npm i stripe @stripe/stripe-js` + clés dans `.env`
- [ ] Créer `app/api/payments/stripe/route.js` (PaymentIntent / Checkout Session)
- [ ] Créer `app/api/webhooks/stripe/route.js` → `payment_intent.succeeded` → `Order.isPaid = true`
- [ ] Brancher dans `OrderSummary.jsx` (COD reste fonctionnel sans Stripe)
- [ ] Remboursements admin

### 8. Emails transactionnels (aucun code mail existant)
- [ ] `npm i resend` + `RESEND_API_KEY`
- [ ] `lib/email.js` + templates : confirmation commande, paiement, expédition, livraison, demande d'avis
- [ ] Les champs `emailVerificationToken` / `passwordResetToken` existent déjà dans `prisma/schema.prisma` mais **aucun code ne les génère** → implémenter `/forgot-password` + `/reset-password`

### 9. Avis & notes
- [ ] Afficher les notes réelles sur la vitrine (voir §1 — les APIs renvoient déjà `avgRating`)
- [ ] Modération admin des avis

---

## 🟡 P2 — QUALITÉ & SÉCURITÉ (CI bloquante)

- [ ] **ESLint** : `npm i -D eslint eslint-config-next` + créer `.eslintrc.json` — `npm run lint` **échoue aujourd'hui** (aucune config, Next invite à en créer une)
- [ ] **Tests** : aucun framework, aucun `*.test.*`, script `test` absent → Jest/Vitest + RTL, tests d'intégration API, Playwright (parcours : inscription → boutique → achat → admin approuve)
- [ ] **CI** : dossier `.github/` absent → GitHub Actions (lint + test + build)
- [ ] **Rate limiting** : absent → obligatoire sur `/api/register` et la connexion (NextAuth) — `@upstash/ratelimit` ou arcjet
- [ ] **Security headers / CSP** : `headers()` absent de `next.config.mjs`
- [ ] **Sanitization** : DOMPurify sur descriptions produits et avis
- [ ] **Prisma migrations** : il n'y a que `schema.prisma`, workflow en `prisma db push` → passer à `prisma migrate dev` + `migrate deploy` en CI
- [x] **Seed admin prod** : `scripts/seed-admin.js` contient un mot de passe en dur (`admin123`) → forcer variable d'env + rotation en prod (desormais `ADMIN_EMAIL`/`ADMIN_PASSWORD` requis)
- [ ] **TypeScript** (optionnel mais roadmap Phase 3) : `tsconfig.json` absent, 0 fichier `.ts/.tsx`

---

## 🟢 P3 — SEO, PERFORMANCE, UX

- [x] **Perf réseau** : base distante (~0,7 s/requête) → clic menu lent. Ajout d'un **cache TTL serveur** (`lib/cache.js`) sur `GET /api/products`, `/api/products/[id]`, `/api/stores/[username]` (TTL 30 s + invalidation sur mutations) + **préchauffage au survol** des liens Accueil/Boutique dans `Navbar.jsx`. Mesures : `/api/products` 1er appel ~1,8–4,4 s puis ~20 ms ; pages prod ~20–32 ms.
- [ ] **Metadata** : `app/layout.jsx` n'a ni `metadataBase`, ni `title.template`, ni `openGraph`/`twitter` — et `app/(public)/page.jsx`, `product/[productId]`, `shop/[username]` sont en `'use client'` → **impossible d'exporter `generateMetadata`** → les passer en server components (ou wrapper) pour le SEO produit/boutique
- [ ] `app/robots.js` + `app/sitemap.js` — absents
- [ ] **JSON-LD** Product/Organization — absent
- [ ] `next.config.mjs` : retirer `images: { unoptimized: true }` (optimisation désactivée), ajouter `images.remotePatterns` (les schemas zod exigent des URL d'images), `experimental.optimizePackageImports: ['lucide-react']`
- [ ] **`noindex`** sur `/cart`, `/checkout`, `/orders` (`cart/head.jsx` a juste `<title>`)
- [ ] Lazy loading des charts recharts (`next/dynamic`), skeletons au lieu du spinner `Loading`
- [ ] Pagination / infinite scroll sur `/shop` (l'API supporte déjà `page`/`limit`)
- [ ] State vide `app/(public)/shop` : filtre client sur données dummy → passer aux query params de l'API

---

## 🔵 P4 — INFRASTRUCTURE & DÉPLOIEMENT

- [ ] **Provider BDD managé** : Neon / Supabase / Railway (aujourd'hui un Postgres local via `.env`)
- [ ] **Variables d'env production** (Vercel Project Settings) :
  - Actuelles : `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_URL`, `NEXT_PUBLIC_CURRENCY_SYMBOL`, `NEXT_PUBLIC_APP_URL`
  - À ajouter : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `NEXT_PUBLIC_SITE_URL` (pour OG/sitemap), `SENTRY_DSN`
  - `.env.example` est à jour partiel : `NEXTAUTH_URL` est **obsolète** en NextAuth v5 (redondant avec `AUTH_URL`), `NEXT_PUBLIC_APP_URL` est déclarée mais jamais lue
- [ ] Déploiement **Vercel** (recommandé) ou Docker — aucun config Docker/CI existante
- [ ] **Monitoring** : 0 trace de Sentry / Vercel Analytics / logs structurés
- [ ] **README** : section « Variables d'Environnement » vide (ligne ~110), stack table incomplète
- [ ] Domaine custom + HTTPS, backups BDD, previews de déploiement

---

## 📋 Ordre de passage recommandé

| # | Étape | Critère "Done" |
|---|-------|----------------|
| 1 | Vitrine branchée sur `/api/products` (+ fix `rating` → `avgRating`) | Un visiteur voit les vrais produits, fiche produit qui marche |
| 2 | Persistance panier (localStorage + `User.cart`) | Panier survivant au rechargement |
| 3 | APIs addresses + orders + `coupons/validate` | POST commande crée une `Order` en base |
| 4 | Page `/checkout` + `OrderSummary` branchés | Achat COD complet de bout en bout |
| 5 | Pages commandes buyer/seller connectées | Statuts mis à jour par le vendeur |
| 6 | Layout vendeur réel (`GET /api/stores`) | Plus aucune donnée dummy dans `app/` ni `components/` |
| 7 | Stripe (test → live) + webhook | `isPaid` passé à `true` automatiquement |
| 8 | Emails (Resend) + reset password | Confirmation commande reçue |
| 9 | ESLint + tests + CI GitHub Actions | `npm run lint` et `npm test` verts en PR |
| 10 | SEO (metadata, robots, sitemap, JSON-LD) | Page produit indexable |
| 11 | Rate limit + headers sécurité | `/api/register` protégé |
| 12 | Déploiement Vercel + domaine + monitoring | Site live, erreurs remontées |

---

## ⚠️ Fonctionnalités non vues du tout (hors Phases 1-5)

- [ ] Création de boutique : `app/(public)/create-store/page.jsx` a `fetchSellerStatus` et `onSubmitHandler` **vides** (pourtant `POST /api/stores` existe) → **un vendeur ne peut pas s'inscrire**
- [ ] `app/(public)/register` / `login` : fonctionnels, mais pas de forgot/reset password
- [ ] Navbar mobile : ni déconnexion ni badge panier (`components/Navbar.jsx:183-196`)
- [ ] Compteur/`ProductDetails` ajoutent au panier un produit qui n'existe que dans le dummy (voir P0 §1)

---

> **En résumé** : les fondations (auth, rôles, back-office, APIs produits/boutiques) sont solides. **Le parcours d'achat COD est désormais complet** (vitrine réelle → panier persisté → checkout → commandes → avis). Restent avant mise en production : **P1** (Stripe, emails/reset password), **P2** (ESLint, tests, CI, rate limit, migrations, headers), **P3** (SEO/metadata), **P4** (déploiement, monitoring), + la **création de boutique** côté vendeur (`create-store`).
