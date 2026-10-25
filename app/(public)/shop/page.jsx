'use client'
import { Suspense, useEffect, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Loading from "@/components/Loading"

function ShopContent() {

    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchProducts = async (query) => {
        try {
            const params = new URLSearchParams()
            if (query) params.set('search', query)
            params.set('limit', '50')

            const res = await fetch(`/api/products?${params.toString()}`)
            if (!res.ok) throw new Error('Impossible de charger les produits')
            const data = await res.json()
            setProducts(data.products)
            setError("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts(search)
    }, [search])

    if (loading) return <Loading />

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer">{search && <MoveLeftIcon size={20} />} Tous les <span className="text-slate-700 font-medium">produits</span></h1>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg my-4 text-sm max-w-4xl">{error}</div>
                )}

                {products.length ? (
                    <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
                        {products.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                ) : (
                    !error && (
                        <div className="flex items-center justify-center h-64">
                            <h1 className="text-2xl text-slate-400 font-medium">{search ? `Aucun produit pour « ${search} »` : 'Aucun produit'}</h1>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}


export default function Shop() {
  return (
    <Suspense fallback={<Loading />}>
      <ShopContent />
    </Suspense>
  );
}