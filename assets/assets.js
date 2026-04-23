import gs_logo from "./gs_logo.jpg"
import happy_store from "./happy_store.webp"
import upload_area from "./upload_area.svg"
import hero_model_img from "./hero_model_img.png"
import hero_product_img1 from "./hero_product_img1.png"
import hero_product_img2 from "./hero_product_img2.png"
import product_img1 from "./product_img1.png"
import product_img2 from "./product_img2.png"
import product_img3 from "./product_img3.png"
import product_img4 from "./product_img4.png"
import product_img5 from "./product_img5.png"
import product_img6 from "./product_img6.png"
import product_img7 from "./product_img7.png"
import product_img8 from "./product_img8.png"
import product_img9 from "./product_img9.png"
import product_img10 from "./product_img10.png"
import product_img11 from "./product_img11.png"
import product_img12 from "./product_img12.png"
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";
import profile_pic1 from "./profile_pic1.jpg"
import profile_pic2 from "./profile_pic2.jpg"
import profile_pic3 from "./profile_pic3.jpg"

export const assets = {
    upload_area, hero_model_img,
    hero_product_img1, hero_product_img2, gs_logo,
    product_img1, product_img2, product_img3, product_img4, product_img5, product_img6,
    product_img7, product_img8, product_img9, product_img10, product_img11, product_img12,
}

export const categories = ["Mode", "Audio", "Montres", "Maison", "Cuisine", "Bureau"];

export const dummyRatingsData = [
    { id: "rat_1", rating: 4.7, review: "Commande recue rapidement a Cotonou. Le produit est propre et conforme aux photos.", user: { name: 'Aminatou Dossou', image: profile_pic1 }, productId: "prod_1", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', product: { name: 'Lampe de table Akwa', category: 'Maison', id: 'prod_1' } },
    { id: "rat_2", rating: 5.0, review: "Tres bon vendeur. L'enceinte marche bien et la livraison a ete rapide sur Abomey-Calavi.", user: { name: 'Kevin Gandonou', image: profile_pic2 }, productId: "prod_2", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', product: { name: 'Enceinte bluetooth Cotonou', category: 'Audio', id: 'prod_2' } },
    { id: "rat_3", rating: 4.5, review: "La montre est elegante et facile a utiliser. Bon rapport qualite prix.", user: { name: 'Mireille Kora', image: profile_pic3 }, productId: "prod_3", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', product: { name: 'Montre connectee Porto-Novo', category: 'Montres', id: 'prod_3' } },
    { id: "rat_4", rating: 4.8, review: "J'ai aime le suivi de commande et l'emballage. Rien a redire.", user: { name: 'Arlette Hounkpe', image: profile_pic1 }, productId: "prod_4", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', product: { name: 'Casque sans fil Ganvie', category: 'Audio', id: 'prod_4' } },
    { id: "rat_5", rating: 4.4, review: "Produit pratique pour la maison et service client tres reactif sur WhatsApp.", user: { name: 'Ruth Adje', image: profile_pic2 }, productId: "prod_5", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', product: { name: 'Montre noire Fidjrosse', category: 'Montres', id: 'prod_5' } },
    { id: "rat_6", rating: 5.0, review: "Super experience sur Go-shop. Je recommande cette boutique a mes proches.", user: { name: 'Sonia Biaou', image: profile_pic3 }, productId: "prod_6", createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0100', product: { name: 'Camera securite Calavi', category: 'Maison', id: 'prod_6' } },
]

export const dummyStoreData = {
    id: "store_1",
    userId: "user_1",
    name: "Go-shop Dantokpa",
    description: "Go-shop Dantokpa propose une selection moderne de produits utiles pour la maison, le bureau et le quotidien, avec un service adapte aux clients du Benin.",
    username: "goshop-dantokpa",
    address: "Rue du grand marche Dantokpa, Cotonou, Benin",
    status: "approved",
    isActive: true,
    logo: happy_store,
    email: "bonjour@goshop.bj",
    contact: "+2290190000000",
    createdAt: "2025-09-04T09:04:16.189Z",
    updatedAt: "2025-09-04T09:04:44.273Z",
    user: {
        id: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "Afi Kora",
        email: "afi@goshop.bj",
        image: gs_logo,
    }
}

export const productDummyData = [
    {
        id: "prod_1",
        name: "Lampe de table Akwa",
        description: "Une lampe elegante pour chambre, bureau ou boutique. Son style moderne s'adapte bien aux interieurs de Cotonou et elle apporte un eclairage doux au quotidien.",
        mrp: 40,
        price: 29,
        images: [product_img1, product_img2, product_img3, product_img4],
        category: "Maison",
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 29 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 29 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_2",
        name: "Enceinte bluetooth Cotonou",
        description: "Une enceinte compacte avec un son propre pour vos soirees, votre salon ou votre stand de vente.",
        mrp: 50,
        price: 29,
        images: [product_img2],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Audio",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 28 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 28 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_3",
        name: "Montre connectee Porto-Novo",
        description: "Une montre pratique pour suivre vos activites, vos appels et votre routine journaliere.",
        mrp: 60,
        price: 29,
        images: [product_img3],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Montres",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 27 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 27 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_4",
        name: "Casque sans fil Ganvie",
        description: "Un casque confortable pour la musique, les appels et le travail en ligne sans bruit parasite.",
        mrp: 70,
        price: 29,
        images: [product_img4],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Audio",
        rating: dummyRatingsData,
        createdAt: 'Sat Jul 26 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 26 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_5",
        name: "Montre noire Fidjrosse",
        description: "Une montre sobre et facile a porter pour le bureau, les sorties et les rendez-vous.",
        mrp: 49,
        price: 29,
        images: [product_img5],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Montres",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_6",
        name: "Camera securite Calavi",
        description: "Une camera simple a installer pour la maison, la boutique ou le depot.",
        mrp: 59,
        price: 29,
        images: [product_img6],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Maison",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 25 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 25 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_7",
        name: "Stylet tactile Bohicon",
        description: "Un stylet leger pour tablette, prise de notes et dessin numerique.",
        mrp: 89,
        price: 29,
        images: [product_img7],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Bureau",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 24 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 24 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_8",
        name: "Home cinema Dantokpa",
        description: "Un systeme audio pour transformer vos films et evenements en vrai moment de plaisir a la maison.",
        mrp: 99,
        price: 29,
        images: [product_img8],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Audio",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 23 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 23 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_9",
        name: "Ecouteurs sans fil Ganhito",
        description: "Des ecouteurs pratiques pour les deplacements, les appels et la musique sans fil.",
        mrp: 89,
        price: 29,
        images: [product_img9],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Audio",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 22 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 22 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_10",
        name: "Montre Benin Fit",
        description: "Une montre intelligente au design propre pour suivre votre activite et vos notifications.",
        mrp: 179,
        price: 29,
        images: [product_img10],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Montres",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 21 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 21 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_11",
        name: "Souris gamer Seme",
        description: "Une souris reactive et confortable pour le travail, les jeux et les longues sessions sur ordinateur.",
        mrp: 39,
        price: 29,
        images: [product_img11],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Bureau",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 20 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 20 2025 14:51:25 GMT+0100',
    },
    {
        id: "prod_12",
        name: "Aspirateur maison Ouidah",
        description: "Un appareil pratique pour garder la maison propre sans effort, ideal pour un usage quotidien.",
        mrp: 199,
        price: 29,
        images: [product_img12],
        storeId: "seller_1",
        inStock: true,
        store: dummyStoreData,
        category: "Maison",
        rating: [...dummyRatingsData, ...dummyRatingsData],
        createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100',
        updatedAt: 'Sat Jul 19 2025 14:51:25 GMT+0100',
    }
];

export const ourSpecsData = [
    { title: "Livraison locale rapide", description: "Recevez vos commandes rapidement dans les principales villes du Benin.", icon: SendIcon, accent: '#05DF72' },
    { title: "Retours simples", description: "Changez d'avis en toute serenite avec une procedure claire sur 7 jours.", icon: ClockFadingIcon, accent: '#FF8904' },
    { title: "Assistance 7j/7", description: "Notre equipe vous accompagne sur WhatsApp et par email quand vous en avez besoin.", icon: HeadsetIcon, accent: '#A684FF' }
]

export const addressDummyData = {
    id: "addr_1",
    userId: "user_1",
    name: "Clarisse Ahouansou",
    email: "clarisse@example.bj",
    street: "Rue 123, Cadjehoun",
    city: "Cotonou",
    state: "Littoral",
    zip: "22901",
    country: "Benin",
    phone: "+2290191000000",
    createdAt: 'Sat Jul 19 2025 14:51:25 GMT+0100',
}

export const couponDummyData = [
    { code: "BIENVENUE20", description: "20% de reduction pour une premiere commande", discount: 20, forNewUser: true, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:31.183Z" },
    { code: "COTONOU10", description: "10% de reduction sur les selections locales", discount: 10, forNewUser: false, forMember: false, isPublic: true, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:35:50.653Z" },
    { code: "BENIN15", description: "15% de reduction sur les produits maison", discount: 15, forNewUser: false, forMember: false, isPublic: false, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:00.811Z" },
    { code: "GO10", description: "10% de reduction sur tout le site", discount: 10, forNewUser: false, forMember: false, isPublic: true, expiresAt: "2026-12-31T00:00:00.000Z", createdAt: "2025-08-22T08:42:21.279Z" },
    { code: "VIPSHOP", description: "10% de reduction pour les membres premium", discount: 10, forNewUser: false, forMember: true, isPublic: false, expiresAt: "2027-03-06T00:00:00.000Z", createdAt: "2025-08-22T11:38:20.194Z" }
]

export const dummyUserData = {
    id: "user_31dQbH27HVtovbs13X2cmqefddM",
    name: "Equipe Go-shop",
    email: "support@goshop.bj",
    image: gs_logo,
    cart: {}
}

export const orderDummyData = [
    {
        id: "cmemm75h5001jtat89016h1p3",
        total: 214.2,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:15:03.929Z",
        updatedAt: "2025-08-22T09:15:50.723Z",
        isCouponUsed: true,
        coupon: couponDummyData[1],
        orderItems: [
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlydnx0017tat8h3rg92hz", quantity: 1, price: 89, product: productDummyData[0] },
            { orderId: "cmemm75h5001jtat89016h1p3", productId: "cmemlxgnk0015tat84qm8si5v", quantity: 1, price: 149, product: productDummyData[1] }
        ],
        address: addressDummyData,
        user: dummyUserData
    },
    {
        id: "cmemm6jv7001htat8vmm3gxaf",
        total: 421.6,
        status: "DELIVERED",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        storeId: "cmemkqnzm000htat8u7n8cpte",
        addressId: "cmemm6g95001ftat8omv9b883",
        isPaid: false,
        paymentMethod: "COD",
        createdAt: "2025-08-22T09:14:35.923Z",
        updatedAt: "2025-08-22T09:15:52.535Z",
        isCouponUsed: true,
        coupon: couponDummyData[0],
        orderItems: [
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm1f3y001dtat8liccisar", quantity: 1, price: 229, product: productDummyData[2] },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemm0nh2001btat8glfvhry1", quantity: 1, price: 99, product: productDummyData[3] },
            { orderId: "cmemm6jv7001htat8vmm3gxaf", productId: "cmemlz8640019tat8kz7emqca", quantity: 1, price: 199, product: productDummyData[4] }
        ],
        address: addressDummyData,
        user: dummyUserData
    }
]

export const storesDummyData = [
    {
        id: "cmemkb98v0001tat8r1hiyxhn",
        userId: "user_31dOriXqC4TATvc0brIhlYbwwc5",
        name: "Go-shop Porto-Novo",
        description: "Une boutique de reference pour les accessoires tech, objets utiles et cadeaux du quotidien au coeur de Porto-Novo.",
        username: "goshop-porto-novo",
        address: "Quartier Ouando, Porto-Novo, Benin",
        status: "approved",
        isActive: true,
        logo: gs_logo,
        email: "porto-novo@goshop.bj",
        contact: "+2290192000000",
        createdAt: "2025-08-22T08:22:16.189Z",
        updatedAt: "2025-08-22T08:22:44.273Z",
        user: dummyUserData,
    },
    {
        id: "cmemkqnzm000htat8u7n8cpte",
        userId: "user_31dQbH27HVtovbs13X2cmqefddM",
        name: "Go-shop Dantokpa",
        description: "Une selection de produits tendances, utiles et accessibles pour la maison, la boutique et le quotidien a Cotonou.",
        username: "goshop-dantokpa",
        address: "Rue du grand marche Dantokpa, Cotonou, Benin",
        status: "approved",
        isActive: true,
        logo: happy_store,
        email: "bonjour@goshop.bj",
        contact: "+2290190000000",
        createdAt: "2025-08-22T08:34:15.155Z",
        updatedAt: "2025-08-22T08:34:47.162Z",
        user: dummyUserData,
    }
]

export const dummyAdminDashboardData = {
    "orders": 6,
    "stores": 2,
    "products": 12,
    "revenue": "959.10",
    "allOrders": [
        { "createdAt": "2025-08-20T08:46:58.239Z", "total": 145.6 },
        { "createdAt": "2025-08-22T08:46:21.818Z", "total": 97.2 },
        { "createdAt": "2025-08-22T08:45:59.587Z", "total": 54.4 },
        { "createdAt": "2025-08-23T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-23T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-23T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-24T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-24T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-24T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T09:15:03.929Z", "total": 214.2 },
        { "createdAt": "2025-08-25T09:14:35.923Z", "total": 421.6 },
        { "createdAt": "2025-08-25T11:44:29.713Z", "total": 26.1 },
        { "createdAt": "2025-08-25T11:56:29.713Z", "total": 36.1 },
        { "createdAt": "2025-08-25T11:30:29.713Z", "total": 110.1 }
    ]
}

export const dummyStoreDashboardData = {
    "ratings": dummyRatingsData,
    "totalOrders": 2,
    "totalEarnings": 636,
    "totalProducts": 5
}
