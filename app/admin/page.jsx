'use client'
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, ClockIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        pendingStores: 0,
        allOrders: [],
    })

    const fetchDashboardData = async () => {
        try {
            const res = await fetch('/api/admin/dashboard')
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

    const dashboardCardsData = [
        { title: 'Produits', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Chiffre d\'affaires', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Commandes', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Boutiques', value: dashboardData.stores, icon: StoreIcon },
        { title: 'En attente', value: dashboardData.pendingStores, icon: ClockIcon },
    ]

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">Tableau de bord <span className="text-slate-800 font-medium">administrateur</span></h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg my-4 text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className="w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            <OrdersAreaChart allOrders={dashboardData.allOrders} />
        </div>
    )
}
