'use client'
import { addToCart } from "@/lib/features/cart/cartSlice"
import { StarIcon, ShoppingCartIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch()
    const router = useRouter()
    const cart = useSelector(state => state.cart.cartItems)
    const inCart = Boolean(cart[product.id])

    const rating = Math.round(product.avgRating || 0)

    const addToCartHandler = () => {
        if (inCart) {
            router.push('/cart')
            return
        }
        dispatch(addToCart({ productId: product.id }))
    }

    return (
        <div className='group max-xl:mx-auto'>
            <Link href={`/product/${product.id}`}>
                <div className='bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center'>
                    <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300' src={product.images?.[0]} alt="" />
                </div>
                <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                    <div>
                        <p>{product.name}</p>
                        <div className='flex'>
                            {Array(5).fill('').map((_, index) => (
                                <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                            ))}
                        </div>
                    </div>
                    <p>{currency}{product.price}</p>
                </div>
            </Link>
            <button onClick={addToCartHandler} className={`mt-2 flex items-center justify-center gap-2 w-full max-w-60 py-2 text-sm font-medium rounded active:scale-95 transition ${inCart ? 'bg-gray-100 text-slate-700 hover:bg-gray-200' : 'bg-slate-800 text-white hover:bg-slate-900'}`}>
                <ShoppingCartIcon size={16} />
                {inCart ? 'Voir le panier' : 'Ajouter au panier'}
            </button>
        </div>
    )
}

export default ProductCard