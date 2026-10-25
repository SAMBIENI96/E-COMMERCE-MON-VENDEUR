'use client'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { saveCart, setCart } from '@/lib/features/cart/cartSlice'

export default function CartSync() {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart)

    const syncedUserId = useRef(null)

    // Persiste le panier dans le localStorage a chaque changement (invite + connecte)
    useEffect(() => {
        saveCart(cart)
    }, [cart])

    // A la connexion : fusionne le panier local avec celui en base et re-sauvegarde
    useEffect(() => {
        if (status !== 'authenticated' || !session?.user?.id) return

        const userId = session.user.id
        if (syncedUserId.current === userId) return
        syncedUserId.current = userId

        const sync = async () => {
            try {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cart),
                })
                const data = await res.json()
                if (res.ok && data.cart) {
                    dispatch(setCart(data.cart))
                    saveCart(data.cart)
                }
            } catch {
                // sync silencieuse : le panier reste local
            }
        }
        sync()
    }, [status, session, cart, dispatch])

    return null
}