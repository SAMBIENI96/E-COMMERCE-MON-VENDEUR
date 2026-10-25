import { z } from 'zod'

// Categories valides (doit rester en sync avec assets.js)
export const CATEGORIES = ['Mode', 'Audio', 'Montres', 'Maison', 'Cuisine', 'Bureau']

export const productSchema = z.object({
    name: z.string().min(3, 'Nom trop court (min 3)').max(120),
    description: z.string().min(10, 'Description trop courte (min 10)').max(5000),
    mrp: z.number().positive('Prix barre invalide'),
    price: z.number().positive('Prix invalide'),
    images: z.array(z.string().url('URL image invalide')).min(1, 'Au moins 1 image requise').max(6),
    category: z.enum(CATEGORIES, { message: 'Categorie invalide' }),
    inStock: z.boolean().default(true),
})

export const productUpdateSchema = productSchema.partial()

export const storeSchema = z.object({
    name: z.string().min(2, 'Nom trop court').max(80),
    username: z
        .string()
        .min(3, 'Username trop court')
        .max(30)
        .regex(/^[a-z0-9-]+$/, 'Minuscules, chiffres et tirets uniquement'),
    description: z.string().min(10, 'Description trop courte').max(1000),
    address: z.string().min(3, 'Adresse trop courte').max(200),
    logo: z.string().url('Logo invalide'),
    email: z.string().email('Email invalide'),
    contact: z.string().min(6, 'Contact trop court').max(20),
})

export const couponSchema = z.object({
    code: z.string().min(3).max(20).toUpperCase(),
    description: z.string().min(5).max(300),
    discount: z.number().min(1, 'Remise min 1%').max(90, 'Remise max 90%'),
    forNewUser: z.boolean().default(false),
    forMember: z.boolean().default(false),
    isPublic: z.boolean().default(true),
    expiresAt: z.coerce.date(),
})

export const addressSchema = z.object({
    name: z.string().min(2, 'Nom trop court').max(80),
    email: z.string().email('Email invalide'),
    street: z.string().min(3, 'Adresse trop courte').max(200),
    city: z.string().min(2, 'Ville trop courte').max(80),
    state: z.string().min(2, 'Departement trop court').max(80),
    zip: z.string().min(2, 'Code postal trop court').max(20),
    country: z.string().min(2, 'Pays trop court').max(80),
    phone: z.string().min(6, 'Telephone trop court').max(20),
})

export const orderSchema = z.object({
    addressId: z.string().min(1, 'Adresse requise'),
    paymentMethod: z.enum(['COD', 'STRIPE'], { message: 'Mode de paiement invalide' }),
    couponCode: z.string().trim().max(20).optional().nullable(),
    items: z
        .array(
            z.object({
                productId: z.string().min(1),
                quantity: z.number().int().positive('Quantite invalide'),
            })
        )
        .min(1, 'Le panier est vide'),
})

export const ratingSchema = z.object({
    productId: z.string().min(1),
    orderId: z.string().min(1),
    rating: z.number().int().min(1, 'Note minimale : 1').max(5, 'Note maximale : 5'),
    review: z.string().min(5, 'Commentaire trop court').max(1000),
})

export const orderStatusSchema = z.object({
    status: z.enum(['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'], {
        message: 'Statut invalide',
    }),
})
