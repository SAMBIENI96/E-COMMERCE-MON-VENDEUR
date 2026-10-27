'use client'
import PageTitle from "@/components/PageTitle"
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useDispatch } from "react-redux";
import { setRatings } from "@/lib/features/rating/ratingSlice";
import toast from "react-hot-toast";

export default function Orders() {

    const dispatch = useDispatch();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [ordersRes, ratingsRes] = await Promise.all([
                    fetch('/api/orders'),
                    fetch('/api/ratings'),
                ]);
                const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [] };
                const ratingsData = ratingsRes.ok ? await ratingsRes.json() : { ratings: [] };
                setOrders(ordersData.orders || []);
                dispatch(setRatings(ratingsData.ratings || []));
            } catch {
                toast.error('Impossible de charger vos commandes');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [dispatch]);

    if (loading) return <Loading />

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                <div className="my-20 max-w-7xl mx-auto">
                    <PageTitle heading="Mes commandes" text={`Affichage de ${orders.length} commandes`} linkText={'Retour a l\'accueil'} />

                    <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                        <thead>
                            <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                                <th className="text-left">Produit</th>
                                <th className="text-center">Total</th>
                                <th className="text-left">Adresse</th>
                                <th className="text-left">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <OrderItem order={order} key={order.id} />
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Vous n'avez encore aucune commande</h1>
                </div>
            )}
        </div>
    )
}