'use client'
import Counter from "@/components/Counter";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [products, setProducts] = useState([]);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const product = products.find(product => product.id === key);
            if (product) {
                cartArray.push({ ...product, quantity: value });
                setTotalPrice(prev => prev + product.price * value);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (productId) => {
        dispatch(deleteItemFromCart({ productId }))
    }

    useEffect(() => {
        fetch('/api/products?limit=50')
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => setProducts(data.products || []))
            .catch(() => setProducts([]))
    }, [])

    useEffect(() => {
        if (cartItems) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto ">
                <PageTitle heading="Mon panier" text="articles dans votre panier" linkText="Continuer vos achats" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <table className="w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm">
                                <th className="text-left">Produit</th>
                                <th>Quantite</th>
                                <th>Total</th>
                                <th className="max-md:hidden">Retirer</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => (
                                    <tr key={index} className="space-x-2">
                                        <td className="flex gap-3 my-4">
                                            <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                                <Image src={item.images[0]} className="h-14 w-auto" alt="" width={45} height={45} />
                                            </div>
                                            <div>
                                                <p className="max-sm:text-sm">{item.name}</p>
                                                <p className="text-xs text-slate-500">{item.category}</p>
                                                <p>{currency}{item.price}</p>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Counter productId={item.id} />
                                        </td>
                                        <td className="text-center">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                        <td className="text-center max-md:hidden">
                                            <button onClick={() => handleDeleteItemFromCart(item.id)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7">
                        <h2 className="text-xl font-medium text-slate-600">Resume</h2>
                        <div className="flex justify-between py-4 mt-2 border-y border-slate-200">
                            <p>Sous-total :</p>
                            <p className="font-medium text-right">{currency}{totalPrice.toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-slate-400 my-2">Livraison offerte</p>
                        <Link href="/checkout" className="block text-center w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all">
                            Passer la commande
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Votre panier est vide</h1>
        </div>
    )
}
