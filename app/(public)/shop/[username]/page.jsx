'use client'
import ProductCard from "@/components/ProductCard"
import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon } from "lucide-react"
import Loading from "@/components/Loading"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function StoreShop() {

    const { username } = useParams()

    const [products, setProducts] = useState([])
    const [storeInfo, setStoreInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchStoreData = async () => {
        try {
            const [storeRes, productsRes] = await Promise.all([
                fetch(`/api/stores/${username}`),
                fetch(`/api/products?store=${username}&limit=50`),
            ])

            const storeData = await storeRes.json()
            if (!storeRes.ok) throw new Error(storeData.error || 'Boutique introuvable')

            const productsData = await productsRes.json()
            setStoreInfo(storeData.store)
            setProducts(productsData.products || [])
            setError("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStoreData()
    }, [username])

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="min-h-[60vh] mx-6 flex items-center justify-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-6">
            {storeInfo && (
                <div className="max-w-7xl mx-auto bg-slate-50 rounded-xl p-6 md:p-10 mt-6 flex flex-col md:flex-row items-center gap-6 shadow-xs">
                    <Image src={storeInfo.logo} alt={storeInfo.name} className="size-32 sm:size-38 object-cover border-2 border-slate-100 rounded-md" width={200} height={200} />
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-semibold text-slate-800">{storeInfo.name}</h1>
                        <p className="text-sm text-slate-600 mt-2 max-w-lg">{storeInfo.description}</p>
                        <div className="space-y-2 text-sm text-slate-500 mt-4">
                            <div className="flex items-center">
                                <MapPinIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{storeInfo.address}</span>
                            </div>
                            <div className="flex items-center">
                                <MailIcon className="w-4 h-4 text-gray-500 mr-2" />
                                <span>{storeInfo.email}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto mb-40">
                <h1 className="text-2xl mt-12">Produits de la <span className="text-slate-800 font-medium">boutique</span></h1>
                {products.length ? (
                    <div className="mt-5 grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto">
                        {products.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <h1 className="text-2xl text-slate-400 font-medium">Aucun produit disponible</h1>
                    </div>
                )}
            </div>
        </div>
    ) 
}