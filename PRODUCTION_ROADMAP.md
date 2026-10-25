# 🚀 PRODUCTION ROADMAP - E-COMMERCE-MON-VENDEUR

> Checklist exhaustive pour rendre le site **100% fonctionnel en production**

---

## 🔴 PHASE 1 : FONDATIONS CRITIQUES (Bloquantes)

### 1.1 Authentification & Autorisation
- [ ] Installer et configurer **NextAuth.js** (v5) ou **Clerk**
- [ ] Créer modèle `User` complet avec `passwordHash`, `role` (user/seller/admin), `emailVerified`
- [ ] Implémenter pages : `/login`, `/register`, `/forgot-password`, `/reset-password`
- [ ] Ajouter `middleware.ts` pour protéger :
  - `/store/*` → rôle `seller` + store approuvé
  - `/admin/*` → rôle `admin`
  - `/cart`, `/checkout`, `/orders` → utilisateur connecté
- [ ] Provider `SessionProvider` dans `app/layout.jsx`
- [ ] Déconnexion fonctionnelle (bouton dans Navbar)

### 1.2 Routes API Backend (app/api/)
```
app/api/
├── auth/                  # NextAuth endpoints
├── products/
│   ├── GET                # Liste avec filtres (catégorie, store, search, pagination)
│   ├── POST               # Créer produit (seller only)
│   ├── [id]/GET           # Détail produit
│   ├── [id]/PATCH         # Modifier produit (owner only)
│   └── [id]/DELETE        # Supprimer produit (owner only)
├── stores/
│   ├── POST               # Créer demande store (user → pending)
│   ├── [username]/GET     # Page publique boutique
│   └── [id]/PATCH         # Modifier store (owner only)
├── orders/
│   ├── GET                # Mes commandes (buyer) / Commandes store (seller)
│   ├── POST               # Créer commande (checkout)
│   ├── [id]/GET           # Détail commande
│   └── [id]/PATCH         # MAJ statut (seller/admin)
├── cart/
│   ├── GET                # Récupérer panier (DB ou session)
│   ├── POST               # Ajouter item
│   ├── PATCH              # MAJ quantité
│   └── DELETE             # Vider / supprimer item
├── ratings/
│   ├── GET                # Avis produit
│   └── POST               # Laisser avis (acheteur vérifié only)
├── addresses/
│   ├── GET/POST/PATCH/DELETE
├── coupons/ (admin)
│   ├── GET/POST/PATCH/DELETE
└── admin/
    ├── stores/GET         # Liste stores (pending/approved)
    ├── stores/[id]/PATCH  # Approuver/Rejeter store
    ├── dashboard/GET      # Stats globales
    └── coupons/...        # Gestion coupons
```

### 1.3 Connexion Dashboards à la Base de Données
- [x] **Admin Dashboard** (`/app/admin/page.jsx`) : remplacer `dummyAdminDashboardData` par vrai `fetch` vers `/api/admin/dashboard`
- [x] **Store Dashboard** (`/app/store/page.jsx`) : remplacer `dummyStoreDashboardData` par vrai `fetch` vers `/api/store/dashboard`
- [x] **Admin Stores** (`/app/admin/stores/`) : liste + actions approuver/rejeter
- [x] **Admin Coupons** (`/app/admin/coupons/`) : CRUD complet
- [x] **Store Products** : grille produits + actions CRUD

---

## 🟡 PHASE 2 : FONCTIONNALITÉS CORE E-COMMERCE

### 2.1 Panier & Checkout Complets
- [ ] Enrichir `cartSlice` : stocker `{ productId, quantity, price, name, image, storeId }`
- [ ] Persister panier : `localStorage` (guest) + DB (user connecté) + sync à la connexion
- [ ] Page `/cart` : affichage complet, MAJ quantité, suppression, codes promo
- [ ] Page `/checkout` :
  - [ ] Formulaire adresse (sélection/création)
  - [ ] Récap commande + frais livraison
  - [ ] Choix paiement : **COD** + **Stripe**
  - [ ] Application coupon
  - [ ] Validation stock temps réel
- [ ] API `/api/orders` POST : créer commande, vider panier, décrémenter stock, envoyer email

### 2.2 Paiement Stripe
- [ ] Configurer Stripe (test → live)
- [ ] Créer `PaymentIntent` côté serveur
- [ ] Intégrer `Stripe.js` + `Elements` ou `Checkout Session`
- [ ] Webhook `/api/webhooks/stripe` : `payment_intent.succeeded` → MAJ `isPaid=true`
- [ ] Gérer remboursements (admin)

### 2.3 Gestion Commandes (Buyer & Seller)
- [ ] Page `/orders` (buyer) : liste, détail, suivi statut, bouton "Acheter à nouveau"
- [ ] Page `/store/orders` (seller) : liste, filtres statut, MAJ statut (PROCESSING → SHIPPED → DELIVERED)
- [ ] Emails transactionnels (Resend/SendGrid) :
  - [ ] Confirmation commande
  - [ ] Paiement réussi
  - [ ] Expédition + n° tracking
  - [ ] Livraison
  - [ ] Demande avis post-livraison

### 2.4 Système Avis & Notations
- [ ] API `/api/ratings` : POST (acheteur vérifié + commande DELIVERED)
- [ ] Affichage notes sur `ProductCard`, `ProductDetails`
- [ ] Page avis produit avec pagination
- [ ] Modération admin (signaler/supprimer avis)

---

## 🟡 PHASE 3 : QUALITÉ CODE & MAINTENABILITÉ

### 3.1 Migration TypeScript
- [ ] Renommer `.js`/`.jsx` → `.ts`/`.tsx`
- [ ] `npx prisma generate` → types Prisma auto
- [ ] Typer tous les Redux slices (`RootState`, `AppDispatch`)
- [ ] Typer props composants + API routes
- [ ] `tsconfig.json` strict mode

### 3.2 Validation & Sécurité
- [ ] **Zod** schemas pour toutes les API routes (input validation)
- [ ] Rate limiting : `@upstash/ratelimit` ou `arcjet` sur API sensibles
- [ ] CSP Headers (`next.config.mjs` → `headers()`)
- [ ] Sanitization HTML (DOMPurify) pour avis, descriptions
- [ ] Protection CSRF (NextAuth gère, vérifier)

### 3.3 Tests
- [ ] **Unit** : Redux slices, utils, composants purs (Jest + RTL)
- [ ] **Integration** : API routes (Supertest ou MSW)
- [ ] **E2E** : Parcours critiques (Playwright)
  - [ ] Inscription → Création store → Ajout produit → Achat → Paiement
  - [ ] Admin approuve store
- [ ] CI/CD : GitHub Actions (lint, typecheck, tests, build)

### 3.4 Linting & Formatage
- [ ] ESLint config stricte (`next/core-web-vitals` + `prettier` + `import/order`)
- [ ] Prettier + Husky pre-commit hooks
- [ ] `npm run lint` passe sans erreur

---

## 🟢 PHASE 4 : PERFORMANCE, SEO & UX

### 4.1 Performance Next.js
- [ ] Retirer `images.unoptimized: true` → configurer domains autorisés
- [ ] `next.config.mjs` : `experimental.optimizePackageImports: ['lucide-react']`
- [ ] **ISR/SSG** pages publiques : `export const revalidate = 3600` sur `/product/[id]`, `/shop/[username]`
- [ ] Lazy loading : `dynamic()` pour charts (Recharts), modals, éditeurs
- [ ] Bundle analyzer : `@next/bundle-analyzer` → optimiser imports

### 4.2 SEO & Metadata
- [ ] `app/layout.jsx` : metadata de base (title template, description, OG, Twitter)
- [ ] `generateMetadata` sur :
  - [ ] `/` (accueil)
  - [ ] `/product/[id]` (titre=nom produit, image=produit, price, availability)
  - [ ] `/shop/[username]` (titre=nom boutique)
  - [ ] `/cart`, `/checkout` → `noindex`
- [ ] `robots.txt` + `sitemap.xml` (next-sitemap)
- [ ] JSON-LD Product / Organization / Breadcrumb

### 4.3 Accessibilité (a11y)
- [ ] Semantic HTML (main, nav, section, article)
- [ ] Focus visible, skip links
- [ ] ARIA labels sur boutons icon-only
- [ ] Contraste couleurs (Tailwind slate → vérifier)
- [ ] Alt text sur toutes les images

### 4.4 UX Polish
- [ ] Skeletons loaders (pas seulement spinner)
- [ ] Optimistic UI (ajout panier, favori, avis)
- [ ] Toasts cohérents (succès/erreur/info)
- [ ] Empty states illustrés (panier vide, pas de commandes, pas de produits)
- [ ] Pagination / infinite scroll listes produits
- [ ] Filtres avancés (prix, note, catégorie, vendeur)

---

## 🟢 PHASE 5 : OBSERVABILITÉ & DÉPLOIEMENT

### 5.1 Monitoring & Logs
- [ ] **Sentry** (error tracking + performance)
- [ ] **Vercel Analytics** / **PostHog** (analytics produit)
- [ ] Logs structurés (pino) + corrélation request-id

### 5.2 Base de Données Production
- [ ] Provider managé : **Neon** / **Supabase** / **Railway** / **PlanetScale**
- [ ] Connection pooling (PgBouncer via Prisma Data Proxy ou driver adapter)
- [ ] Migrations : `prisma migrate deploy` en CI
- [ ] Backup automatisé + point-in-time recovery
- [ ] Index DB sur requêtes fréquentes (`Product.category`, `Order.userId`, `Order.storeId`)

### 5.3 Infrastructure & Déploiement
- [ ] **Vercel** (recommandé pour Next.js) ou Docker + Railway/Render
- [ ] Variables d'env production (Vercel Project Settings)
- [ ] Preview deployments sur PR
- [ ] Domaine custom + SSL
- [ ] CDN assets (Vercel Edge Network)

### 5.4 Email Transactionnel
- [ ] **Resend** (gratuit 3k/mois) ou **SendGrid**
- [ ] Templates React Email (responsive, dark mode)
- [ ] Queue emails (BullMQ + Redis) ou direct Resend API

---

## 📋 VARIABLES D'ENVIRONNEMENT REQUISES

Créer `.env.example` :
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
DIRECT_URL="postgresql://user:pass@host:5432/db?schema=public"

# Auth (NextAuth)
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="https://votre-domaine.com"

# OAuth Providers (optionnel)
GITHUB_ID=""
GITHUB_SECRET=""
GOOGLE_ID=""
GOOGLE_SECRET=""

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (Resend)
RESEND_API_KEY="re_..."
EMAIL_FROM="no-reply@votre-domaine.com"

# App
NEXT_PUBLIC_CURRENCY_SYMBOL="€"
NEXT_PUBLIC_APP_URL="https://votre-domaine.com"

# Sentry (optionnel)
SENTRY_DSN=""
NEXT_PUBLIC_SENTRY_DSN=""

# Upstash Rate Limit (optionnel)
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

---

## 📦 DÉPENDANCES À AJOUTER

```bash
# Auth
npm i next-auth@beta    # v5 (Next.js 15 compatible)
# ou: npm i @clerk/nextjs

# Validation
npm i zod

# Stripe
npm i stripe @stripe/stripe-js @stripe/react-stripe-js

# Email
npm i resend react-email @react-email/components

# Rate limiting
npm i @upstash/ratelimit @upstash/redis

# Monitoring
npm i @sentry/nextjs

# Utils
npm i clsx tailwind-merge date-fns

# Dev
npm i -D typescript @types/react @types/node eslint-config-prettier prettier husky lint-staged @next/bundle-analyzer
```

---

## 🎯 JALONS SUGGÉRÉS

| Sprint | Livrable | Critère "Done" |
|--------|----------|----------------|
| **S1** | Auth + API Core | User peut s'inscrire, se connecter, session persistée |
| **S2** | Produits & Stores CRUD | Seller crée store → admin approuve → seller ajoute produits |
| **S3** | Panier + Checkout COD | Achat complet COD → commande en DB → email confirmation |
| **S4** | Stripe + Webhooks | Paiement Stripe test → webhook MAJ isPaid → email |
| **S5** | Dashboards Réels | Admin voit stats réelles, seller gère ses commandes |
| **S6** | TypeScript + Tests | Build passe, tests CI verts, coverage > 60% |
| **S7** | SEO + Perf + Déploiement | Lighthouse > 90, sitemap, domaine live, monitoring |

---

## 🔍 AUDIT TECHNIQUE DÉTAILLÉ (Pour référence)

### Fichiers à modifier/créer (priorité haute)
```
🔴 CRÉER
├── app/api/                    # TOUTES les routes API
├── app/(auth)/login/page.tsx
├── app/(auth)/register/page.tsx
├── middleware.ts
├── lib/auth.ts                 # Config NextAuth
├── lib/validations/            # Schémas Zod
├── emails/                     # Templates React Email
├── .env.example
├── .github/workflows/ci.yml
└── sentry.*.config.ts

🔴 MODIFIER
├── app/admin/page.tsx          # Connecter vraie API
├── app/store/page.tsx          # Connecter vraie API
├── app/(public)/cart/page.tsx  # Panier complet
├── app/(public)/checkout/page.tsx
├── lib/features/cart/cartSlice.ts  # Enrichir state
├── components/Navbar.tsx       # User menu, logout
├── prisma/schema.prisma        # Ajouter User.passwordHash, role, emailVerified
├── next.config.mjs             # Images, headers, bundle analyzer
└── app/layout.tsx              # SessionProvider, metadata

🟡 AMÉLIORER
├── components/ProductCard.tsx  # Rating, prix barré, stock
├── components/Rating.tsx       # Lecture seule + formulaire
├── lib/store.ts                # Typer Redux store
└── tailwind.config.ts          # Config complète (si pas v4)
```

---

## ✅ DEFINITION OF DONE (Production Ready)

Le site est **production-ready** quand :

- [ ] Utilisateur peut : s'inscrire, créer boutique, ajouter produits, acheter, payer (COD + Stripe), suivre commandes, laisser avis
- [ ] Vendeur peut : gérer produits, voir commandes, MAJ statuts, voir revenus
- [ ] Admin peut : approuver boutiques, gérer coupons, voir analytics globales
- [ ] 0 erreurs TypeScript, 0 warnings ESLint, build réussi
- [ ] Tests CI passent (unit + integration + e2e kritiques)
- [ ] Déployé sur domaine custom avec HTTPS
- [ ] Monitoring erreurs + analytics actifs
- [ ] Backup DB + plan de reprise configuré
- [ ] Documentation développeur (README, API docs, contribution guide)

---

> **Note** : Ce roadmap est vivant. Ajustez les priorités selon votre équipe, budget et timeline. Commencez par **Phase 1** — sans auth ni API, rien d'autre ne fonctionne vraiment.

---

*Généré automatiquement via audit de codebase - 2026*