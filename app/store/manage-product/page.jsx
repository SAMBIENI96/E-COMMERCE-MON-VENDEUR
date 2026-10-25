'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Link from "next/link"
import Loading from "@/components/Loading"
import { categories } from "@/assets/assets"
import { DeleteIcon, PencilIcon, PlusIcon } from "lucide-react"

export default function StoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [products, setProducts] = useState([])
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: "", description: "", mrp: "", price: "", category: "" })

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/store/products')
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

    const patchProduct = async (id, payload) => {
        const res = await fetch(`/api/products/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Mise a jour impossible')
        return data
    }

    const toggleStock = async (product) => {
        await patchProduct(product.id, { inStock: !product.inStock })
        await fetchProducts()
    }

    const openEdit = (product) => {
        setEditing(product)
        setForm({
            name: product.name,
            description: product.description,
            mrp: product.mrp,
            price: product.price,
            category: product.category,
        })
    }

    const saveEdit = async (e) => {
        e.preventDefault()
        await patchProduct(editing.id, {
            name: form.name,
            description: form.description,
            mrp: Number(form.mrp),
            price: Number(form.price),
            category: form.category,
        })
        setEditing(null)
        await fetchProducts()
    }

    const deleteProduct = async (product) => {
        const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Suppression impossible')
        await fetchProducts()
        return data.message || 'Produit supprime'
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-28">
            <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                <h1 className="text-2xl">Gerer les <span className="text-slate-800 font-medium">produits</span></h1>
                <Link href="/store/add-product" className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-900 transition">
                    <PlusIcon size={18} /> Ajouter un produit
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm max-w-4xl">
                    {error}
                </div>
            )}

            {products.length ? (
                <table className="w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
                    <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Nom</th>
                            <th className="px-4 py-3 hidden md:table-cell">Description</th>
                            <th className="px-4 py-3 hidden md:table-cell">Prix normal</th>
                            <th className="px-4 py-3">Prix</th>
                            <th className="px-4 py-3">Stock</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700">
                        {products.map((product) => (
                            <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3">
                                    <div className="flex gap-2 items-center">
                                        <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images[0]} alt="" />
                                        {product.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                                <td className="px-4 py-3 hidden md:table-cell">{currency} {product.mrp.toLocaleString()}</td>
                                <td className="px-4 py-3">{currency} {product.price.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">
                                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                        <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product), { loading: "Mise a jour..." })} checked={product.inStock} />
                                        <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                        <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                    </label>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <PencilIcon onClick={() => openEdit(product)} className="w-5 h-5 text-slate-500 hover:text-slate-800 cursor-pointer" />
                                        <DeleteIcon onClick={() => toast.promise(deleteProduct(product), { loading: "Suppression...", success: (msg) => msg, error: (err) => err?.message || 'Echec de la suppression' })} className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !error && (
                    <div className="flex flex-col items-center justify-center h-80 gap-4 ring ring-slate-200 rounded max-w-4xl">
                        <h1 className="text-2xl text-slate-400 font-medium">Aucun produit</h1>
                        <p className="text-sm text-slate-400">Ajoutez votre premier produit pour commencer a vendre.</p>
                        <Link href="/store/add-product" className="px-6 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-900 transition">Ajouter un produit</Link>
                    </div>
                )
            )}

            {editing && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <form onSubmit={(e) => toast.promise(saveEdit(e), { loading: "Enregistrement..." })} className="bg-white rounded-lg p-6 w-full max-w-md text-sm flex flex-col gap-3 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl text-slate-800 font-medium">Modifier le produit</h2>

                        <label className="flex flex-col gap-1">
                            Nom
                            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border border-slate-200 outline-slate-400 rounded-md" />
                        </label>

                        <label className="flex flex-col gap-1">
                            Description
                            <textarea rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-2 border border-slate-200 outline-slate-400 rounded-md resize-none" />
                        </label>

                        <div className="flex gap-4">
                            <label className="flex flex-col gap-1 flex-1">
                                Prix normal
                                <input type="number" min={1} required value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} className="p-2 border border-slate-200 outline-slate-400 rounded-md" />
                            </label>
                            <label className="flex flex-col gap-1 flex-1">
                                Prix promo
                                <input type="number" min={1} required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="p-2 border border-slate-200 outline-slate-400 rounded-md" />
                            </label>
                        </div>

                        <label className="flex flex-col gap-1">
                            Categorie
                            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="p-2 border border-slate-200 outline-slate-400 rounded-md">
                                <option value="">Choisir une categorie</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </label>

                        <div className="flex justify-end gap-3 mt-3">
                            <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">Annuler</button>
                            <button className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900 transition active:scale-95">Enregistrer</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    )
}
