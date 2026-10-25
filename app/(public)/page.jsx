'use client'
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";
import { setProduct } from "@/lib/features/product/productSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function Home() {

    const dispatch = useDispatch()

    useEffect(() => {
        fetch('/api/products?limit=50')
            .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Impossible de charger les produits'))))
            .then((data) => {
                if (data.products) dispatch(setProduct(data.products))
            })
            .catch(() => {})
    }, [dispatch])

    return (
        <div>
            <Hero />
            <LatestProducts />
            <BestSelling />
            <OurSpecs />
            <Newsletter />
        </div>
    );
}
