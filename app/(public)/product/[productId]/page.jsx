'use client'
import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Product() {

    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProduct = async () => {
        try {
            const res = await fetch(`/api/products/${productId}`)
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || 'Produit introuvable')
            }
            const data = await res.json()
            setProduct(data.product)
            setError("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProduct()
        scrollTo(0, 0)
    }, [productId]);

    if (loading) return <Loading />

    if (error) {
        return (
            <div className="mx-6">
                <div className="max-w-7xl mx-auto min-h-[60vh] flex items-center justify-center">
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">{error}</div>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-gray-600 text-sm mt-8 mb-5">
                    Accueil / Produits / {product?.category}
                </div>

                {product && (<ProductDetails product={product} />)}
                {product && (<ProductDescription product={product} />)}
            </div>
        </div>
    );
}