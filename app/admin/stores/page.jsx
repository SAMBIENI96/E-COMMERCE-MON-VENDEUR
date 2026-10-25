'use client'
import StoreInfo from "@/components/admin/StoreInfo"
import Loading from "@/components/Loading"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const STATUS_FILTERS = [
    { value: '', label: 'Toutes' },
    { value: 'pending', label: 'En attente' },
    { value: 'approved', label: 'Approuvees' },
    { value: 'rejected', label: 'Rejetees' },
]

export default function AdminStores() {

    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [filter, setFilter] = useState('')

    const fetchStores = async (status = '') => {
        try {
            const res = await fetch(`/api/admin/stores${status ? `?status=${status}` : ''}`)
            if (!res.ok) throw new Error('Impossible de charger les boutiques')
            const data = await res.json()
            setStores(data.stores)
            setError("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const updateStore = async (payload) => {
        const res = await fetch('/api/admin/stores', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Mise a jour impossible')
        await fetchStores(filter)
    }

    const changeFilter = (status) => {
        setFilter(status)
        fetchStores(status)
    }

    useEffect(() => {
        fetchStores('')
    }, [])

    return !loading ? (
        <div className="text-slate-500 mb-28">
            <h1 className="text-2xl">Gestion des <span className="text-slate-800 font-medium">boutiques</span></h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg my-4 text-sm max-w-4xl">
                    {error}
                </div>
            )}

            <div className="flex gap-2 mt-4 flex-wrap">
                {STATUS_FILTERS.map((status) => (
                    <button
                        key={status.value}
                        onClick={() => changeFilter(status.value)}
                        className={`px-4 py-1.5 rounded-full text-sm border transition ${filter === status.value ? 'bg-slate-700 text-white border-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                    >
                        {status.label}
                    </button>
                ))}
            </div>

            {stores.length ? (
                <div className="flex flex-col gap-4 mt-4">
                    {stores.map((store) => (
                        <div key={store.id} className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl" >
                            <StoreInfo store={store} />
                            <div className="flex items-center gap-3 pt-2 flex-wrap">
                                {store.status !== 'approved' && (
                                    <button
                                        onClick={() => toast.promise(updateStore({ storeId: store.id, status: 'approved' }), { loading: "Validation..." })}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                                    >
                                        Approuver
                                    </button>
                                )}
                                {store.status !== 'rejected' && (
                                    <button
                                        onClick={() => toast.promise(updateStore({ storeId: store.id, status: 'rejected' }), { loading: "Refus..." })}
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Rejeter
                                    </button>
                                )}
                                {store.status === 'approved' && (
                                    <div className="flex items-center gap-3">
                                        <p>Active</p>
                                        <label className="relative inline-flex items-center cursor-pointer text-gray-900">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                onChange={() => toast.promise(updateStore({ storeId: store.id, isActive: !store.isActive }), { loading: "Mise a jour..." })}
                                                checked={store.isActive}
                                            />
                                            <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                            <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                !error && (
                    <div className="flex items-center justify-center h-80">
                        <h1 className="text-3xl text-slate-400 font-medium">Aucune boutique</h1>
                    </div>
                )
            )}
        </div>
    ) : <Loading />
}
