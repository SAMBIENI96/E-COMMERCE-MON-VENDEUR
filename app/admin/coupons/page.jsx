'use client'
import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { DeleteIcon, PencilIcon } from "lucide-react"
import Loading from "@/components/Loading"

const emptyCoupon = {
    code: '',
    description: '',
    discount: '',
    forNewUser: false,
    forMember: false,
    isPublic: true,
    expiresAt: new Date()
}

export default function AdminCoupons() {

    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editingCode, setEditingCode] = useState(null)

    const [newCoupon, setNewCoupon] = useState(emptyCoupon)

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/admin/coupons')
            if (!res.ok) throw new Error('Impossible de charger les codes promo')
            const data = await res.json()
            setCoupons(data.coupons)
            setError("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setNewCoupon(emptyCoupon)
        setEditingCode(null)
    }

    const handleAddCoupon = async (e) => {
        e.preventDefault()

        const payload = {
            code: newCoupon.code.trim().toUpperCase(),
            description: newCoupon.description.trim(),
            discount: Number(newCoupon.discount),
            forNewUser: newCoupon.forNewUser,
            forMember: newCoupon.forMember,
            isPublic: newCoupon.isPublic,
            expiresAt: new Date(newCoupon.expiresAt).toISOString(),
        }

        const isEdit = Boolean(editingCode)

        const res = await fetch('/api/admin/coupons', {
            method: isEdit ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Enregistrement impossible')

        resetForm()
        await fetchCoupons()
    }

    const handleChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value })
    }

    const editCoupon = (coupon) => {
        setEditingCode(coupon.code)
        setNewCoupon({
            code: coupon.code,
            description: coupon.description,
            discount: coupon.discount,
            forNewUser: coupon.forNewUser,
            forMember: coupon.forMember,
            isPublic: coupon.isPublic,
            expiresAt: coupon.expiresAt,
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const deleteCoupon = async (code) => {
        const res = await fetch(`/api/admin/coupons?code=${encodeURIComponent(code)}`, {
            method: 'DELETE',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Suppression impossible')

        if (editingCode === code) resetForm()
        await fetchCoupons()
    }

    useEffect(() => {
        fetchCoupons();
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500 mb-40">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg my-4 text-sm max-w-4xl">
                    {error}
                </div>
            )}

            <form onSubmit={(e) => toast.promise(handleAddCoupon(e), { loading: editingCode ? "Modification du code promo..." : "Ajout du code promo..." })} className="max-w-sm text-sm">
                <h2 className="text-2xl">{editingCode ? 'Modifier le ' : 'Ajouter des '}<span className="text-slate-800 font-medium">code promo</span></h2>
                <div className="flex gap-2 max-sm:flex-col mt-2">
                    <input type="text" placeholder="Code promo" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md disabled:bg-slate-100" name="code" value={newCoupon.code} onChange={handleChange} disabled={Boolean(editingCode)} required />
                    <input type="number" placeholder="Reduction (%)" min={1} max={90} className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md" name="discount" value={newCoupon.discount} onChange={handleChange} required />
                </div>
                <input type="text" placeholder="Description du code promo" className="w-full mt-2 p-2 border border-slate-200 outline-slate-400 rounded-md" name="description" value={newCoupon.description} onChange={handleChange} required />

                <label>
                    <p className="mt-3">Date d'expiration</p>
                    <input type="date" className="w-full mt-1 p-2 border border-slate-200 outline-slate-400 rounded-md" name="expiresAt" value={format(newCoupon.expiresAt, 'yyyy-MM-dd')} onChange={handleChange} required />
                </label>

                <div className="mt-5">
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer" name="forNewUser" checked={newCoupon.forNewUser} onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })} />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>Nouveaux clients</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer" name="forMember" checked={newCoupon.forMember} onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })} />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>Membres premium</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                    <button className="p-2 px-10 rounded bg-slate-700 text-white active:scale-95 transition">{editingCode ? 'Enregistrer' : 'Ajouter'}</button>
                    {editingCode && (
                        <button type="button" onClick={resetForm} className="p-2 px-6 rounded border border-slate-300 hover:bg-slate-100 transition">Annuler</button>
                    )}
                </div>
            </form>

            <div className="mt-14">
                <h2 className="text-2xl">Liste des <span className="text-slate-800 font-medium">codes promo</span></h2>
                <div className="overflow-x-auto mt-4 rounded-lg border border-slate-200 max-w-4xl">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Code</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Description</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Reduction</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Expire le</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Nouveau client</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Premium</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400">Aucun code promo</td>
                                </tr>
                            )}
                            {coupons.map((coupon) => (
                                <tr key={coupon.code} className={`hover:bg-slate-50 ${editingCode === coupon.code ? 'bg-slate-100' : ''}`}>
                                    <td className="py-3 px-4 font-medium text-slate-800">{coupon.code}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.description}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.discount}%</td>
                                    <td className="py-3 px-4 text-slate-800">{format(coupon.expiresAt, 'yyyy-MM-dd')}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.forNewUser ? 'Oui' : 'Non'}</td>
                                    <td className="py-3 px-4 text-slate-800">{coupon.forMember ? 'Oui' : 'Non'}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <PencilIcon onClick={() => editCoupon(coupon)} className="w-5 h-5 text-slate-500 hover:text-slate-800 cursor-pointer" />
                                            <DeleteIcon onClick={() => toast.promise(deleteCoupon(coupon.code), { loading: "Suppression..." })} className="w-5 h-5 text-red-500 hover:text-red-800 cursor-pointer" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
