import { createSlice } from '@reduxjs/toolkit'

export const CART_STORAGE_KEY = 'gocart-cart'

const isClient = typeof window !== 'undefined'

const emptyCart = { total: 0, cartItems: {} }

export const loadCart = () => {
    if (!isClient) return null
    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (!parsed || typeof parsed.total !== 'number' || typeof parsed.cartItems !== 'object' || parsed.cartItems === null) {
            return null
        }
        return parsed
    } catch {
        return null
    }
}

export const saveCart = (cart) => {
    if (!isClient) return
    try {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
        // stockage indisponible (mode privé...) : ignore
    }
}

export const clearCartStorage = () => {
    if (!isClient) return
    try {
        window.localStorage.removeItem(CART_STORAGE_KEY)
    } catch {
        // ignore
    }
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: emptyCart,
    reducers: {
        addToCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]++
            } else {
                state.cartItems[productId] = 1
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId]--
                if (state.cartItems[productId] === 0) {
                    delete state.cartItems[productId]
                }
                state.total -= 1
            }
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId] : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
        setCart: (state, action) => {
            state.cartItems = action.payload.cartItems || {}
            state.total = action.payload.total || 0
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart, setCart } = cartSlice.actions

export default cartSlice.reducer