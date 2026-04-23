# 🚀 E-COMMERCE-MON-VENDEUR

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)
![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2d3748?style=flat)

</div>

> Une plateforme e-commerce multi-vendeurs construite avec Next.js et Tailwind CSS.

---

## ✨ Fonctionnalités

### 🛒 Pour les Clients

- Interface utilisateur moderne et responsive
- Parcours d'achat fluide avec panier persisté
- Système de notation et avis produits
- Gestion des adresses de livraison
- Suivi des commandes

### 🏪 Pour les Vendeurs

- Tableau de bord dédié (`/store`)
- Gestion des produits (ajout, modification, suppression)
- Suivi des ventes et analytiques
- Gestion des commandes
- Personnalisation de la boutique

### ⚙️ Pour les Administrateurs

- Panel d'administration (`/admin`)
- Approbation des boutiques vendeurs
- Gestion des coupons de réduction
- Vue d'ensemble de toutes les boutiques
- Suivi platforme

---

## 🛠️ Stack Technique

| Catégorie           | Technologie             |
| ------------------- | ----------------------- |
| **Framework**       | Next.js 15 (App Router) |
| **Styling**         | Tailwind CSS 4          |
| **Base de données** | PostgreSQL + Prisma     |
| **État**            | Redux Toolkit           |
| **Icons**           | Lucide React            |
| **Notifications**   | React Hot Toast         |
| **Graphiques**      | Recharts                |
| **Dates**           | date-fns                |

---

## 📁 Structure du Projet

```
gocart/
├── app/                    # Routes Next.js
│   ├── (public)/          # Boutique publique
│   │   ├── page.jsx      # Page d'accueil
│   │   ├── cart/         # Panier
│   │   ├── shop/         # Boutique utilisateur
│   │   └── product/      # Détails produit
│   ├── admin/            # Panel administrateur
│   └── store/            # Dashboard vendeur
├── components/            # Composants React
│   ├── admin/            # Composants admin
│   └── store/            # Composants vendeur
├── lib/                   # Logique métier
│   └── features/         # Redux slices
└── prisma/               # Schéma de base de données
```

---

## 🚦 Getting Started

### Prérequis

- Node.js 18+
- PostgreSQL (local ou cloud)

### Installation

```bash
# Cloner le projet
git clone https://github.com/SAMBIENI96/E-COMMERCE-MON-VENDEUR.git
cd E-COMMERCE-MON-VENDEUR

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos identifiants PostgreSQL

# Initialiser la base de données
npx prisma generate
npx prisma db push

# Lancer le serveur de développement
npm run dev
```

### Variables d'Environnement

---

## 📱 Pages Principales

| Route              | Description                 |
| ------------------ | --------------------------- |
| `/`                | Page d'accueil publique     |
| `/shop/[username]` | Boutique d'un vendeur       |
| `/product/[id]`    | Détails d'un produit        |
| `/cart`            | Panier utilisateur          |
| `/create-store`    | Créer une nouvelle boutique |
| `/store`           | Dashboard vendeur           |
| `/admin`           | Panel administrateur        |
