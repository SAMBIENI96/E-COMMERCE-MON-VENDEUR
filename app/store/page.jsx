'use client'
import Loading from "@/components/Loading"
import { CircleDollarSignIcon, ShoppingBasketIcon, StarIcon, TagsIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Dashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalEarnings: 0,
        totalOrders: 0,
        ratings: [],
        hasStore: true,
    })

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/store/dashboard')
            if (!res.ok) throw new Error('Impossible de charger les donnees')
            const data = await res.json()
            setDashboardData(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    // Pas encore de boutique -> proposer la creation
    if (!dashboardData.hasStore) {
        return (
            <div className="text-slate-500 max-w-lg mx-auto py-20 text-center">
                <h1 className="text-2xl mb-4">Vous n'avez pas encore de boutique</h1>
                <p className="text-sm mb-6">Creez votre boutique pour commencer a vendre sur Go-shop.</p>
                <Link
                    href="/create-store"
                    className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                    Creer ma boutique
                </Link>
            </div>
        )
    }

    const dashboardCardsData = [
        { title: 'Produits', value: dashboardData.totalProducts, icon: ShoppingBasketIcon },
        { title: 'Revenus', value: currency + dashboardData.totalEarnings, icon: CircleDollarSignIcon },
        { title: 'Commandes', value: dashboardData.totalOrders, icon: TagsIcon },
        { title: 'Avis', value: dashboardData.ratings.length, icon: StarIcon },
    ]

    return (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Tableau de bord <span className="text-slate-800 font-medium">vendeur</span></h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg my-4 text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-11 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            <h2>Avis recents</h2>

            <div className="mt-5">
                {
                    dashboardData.ratings.length === 0 && (
                        <p className="text-sm text-slate-400 py-6">Aucun avis pour le moment.</p>
                    )
                }
                {
                    dashboardData.ratings.map((review, index) => (
                        <div key={index} className="flex max-sm:flex-col gap-5 sm:items-center justify-between py-6 border-b border-slate-200 text-sm text-slate-600 max-w-4xl">
                            <div>
                                <div className="flex gap-3">
                                    <Image src={review.user.image || '/profile_placeholder.png'} alt="" className="w-10 aspect-square rounded-full" width={100} height={100} />
                                    <div>
                                        <p className="font-medium">{review.user.name}</p>
                                        <p className="font-light text-slate-500">{new Date(review.createdAt).toDateString()}</p>
                                    </div>
                                </div>
                                <p className="mt-3 text-slate-500 max-w-xs leading-6">{review.review}</p>
                            </div>
                            <div className="flex flex-col justify-between gap-6 sm:items-end">
                                <div className="flex flex-col sm:items-end">
                                    <p className="text-slate-400">{review.product?.category}</p>
                                    <p className="font-medium">{review.product?.name}</p>
                                    <div className='flex items-center'>
                                        {Array(5).fill('').map((_, ratingIndex) => (
                                            <StarIcon key={ratingIndex} size={17} className='text-transparent mt-0.5' fill={review.rating >= ratingIndex + 1 ? "#00C950" : "#D1D5DB"} />
                                        ))}
                                    </div>
                                </div>
                                {review.product && (
                                    <button onClick={() => router.push(`/product/${review.product.id}`)} className="bg-slate-100 px-5 py-2 hover:bg-slate-200 rounded transition-all">Voir le produit</button>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}
