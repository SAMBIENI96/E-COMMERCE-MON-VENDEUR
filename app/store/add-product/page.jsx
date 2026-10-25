'use client'
import { assets, categories } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
})

export default function StoreAddProduct() {

    const router = useRouter()

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const files = Object.values(images).filter(Boolean)
            if (!files.length) throw new Error('Ajoutez au moins une image au produit')

            const imagesDataUrl = await Promise.all(files.map(fileToDataUrl))

            const payload = {
                name: productInfo.name.trim(),
                description: productInfo.description.trim(),
                mrp: Number(productInfo.mrp),
                price: Number(productInfo.price),
                category: productInfo.category,
                images: imagesDataUrl,
                inStock: true,
            }

            if (payload.price > payload.mrp) {
                throw new Error('Le prix de vente ne peut pas depasser le prix barre (MRP)')
            }

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Ajout impossible')

            router.push('/store/manage-product')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Ajout du produit...", success: "Produit ajoute", error: (err) => err?.message || "Echec de l'ajout" })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Ajouter un <span className="text-slate-800 font-medium">produit</span></h1>
            <p className="mt-7">Images du produit</p>

            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6 ">
                Nom
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Entrez le nom du produit" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Entrez la description du produit" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2 ">
                    Prix normal
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label className="flex flex-col gap-2 ">
                    Prix promo
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>

            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Choisir une categorie</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition disabled:opacity-60">Ajouter le produit</button>
        </form>
    )
}
