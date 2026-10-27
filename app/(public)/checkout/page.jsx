'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import Loading from "@/components/Loading";
import { setAddressList } from "@/lib/features/address/addressSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Checkout() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const dispatch = useDispatch();

    const { cartItems } = useSelector(state => state.cart);

    const [loading, setLoading] = useState(true);
    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const [productsRes, addressesRes] = await Promise.all([
                    fetch('/api/products?limit=50'),
                    fetch('/api/addresses'),
                ]);
                const productsData = productsRes.ok ? await productsRes.json() : { products: [] };
                if (addressesRes.ok) {
                    const addressesData = await addressesRes.json();
                    dispatch(setAddressList(addressesData.addresses || []));
                }
                if (!active) return;

                const products = productsData.products || [];
                const items = [];
                let total = 0;
                for (const [id, quantity] of Object.entries(cartItems || {})) {
                    const product = products.find((p) => p.id === id);
                    if (product) {
                        items.push({ ...product, quantity });
                        total += product.price * quantity;
                    }
                }
                setCartArray(items);
                setTotalPrice(total);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => { active = false; };
    }, [cartItems, dispatch]);

    if (loading) return <Loading />

    if (cartArray.length === 0) {
        return (
            <div className="min-h-[80vh] mx-6 flex flex-col gap-4 items-center justify-center text-slate-400">
                <h1 className="text-2xl sm:text-4xl font-semibold">Votre panier est vide</h1>
                <Link href="/shop" className="text-slate-600 underline">Continuer vos achats</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen mx-6 text-slate-800">
            <div className="max-w-7xl mx-auto">
                <PageTitle heading="Finaliser la commande" text="articles" linkText="Retour au panier" path="/cart" />

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
                            {cartArray.map((item) => (
                                <tr key={item.id} className="space-x-2">
                                    <td className="flex gap-3 my-4">
                                        <div className="flex gap-3 items-center justify-center bg-slate-100 size-18 rounded-md">
                                            <Image src={item.images?.[0]} className="h-14 w-auto" alt="" width={45} height={45} />
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
                                        <Link href="/cart" className="inline-flex text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                            <Trash2Icon size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    )
}