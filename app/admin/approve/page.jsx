'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApprove() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchStores = async () => {
        try {
            const res = await fetch('/api/admin/stores?status=pending')
            if (!res.ok) throw new Error('Impossible de charger les demandes')
            const data = await res.json()
            setStores(data.stores)
            setError("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async ({ storeId, status }) => {
        const res = await fetch('/api/admin/stores', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ storeId, status }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Mise a jour impossible')
        await fetchStores()
    }

    useEffect(() => {
        fetchStores()
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Validation des <span className="text-slate-800 font-medium">boutiques</span></h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg my-4 text-sm max-w-4xl">
                    {error}
                </div>
            )}

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            <StoreInfo store={store} />
                            <div className="flex gap-3 pt-2 flex-wrap">
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'approved' }), { loading: "Validation..." })} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm" >
                                    Valider
                                </button>
                                <button onClick={() => toast.promise(handleApprove({ storeId: store.id, status: 'rejected' }), { loading: 'Refus...' })} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm" >
                                    Refuser
                                </button>
                            </div>
                        </div>
                    ))}

                </div>) : (
                !error && (
                    <div className="flex items-center justify-center h-80">
                        <h1 className="text-3xl text-slate-400 font-medium">Aucune demande en attente</h1>
                    </div>
                )
            )}
        </div>
    ) : <Loading />
}
