import { configureStore } from '@reduxjs/toolkit'
import cartReducer, { loadCart } from './features/cart/cartSlice'
import productReducer from './features/product/productSlice'
import addressReducer from './features/address/addressSlice'
import ratingReducer from './features/rating/ratingSlice'

export const makeStore = () => {
    // Rehydrate le panier depuis le localStorage (invites) au chargement
    const preloadedCart = typeof window !== 'undefined' ? loadCart() : null

    return configureStore({
        reducer: {
            cart: cartReducer,
            product: productReducer,
            address: addressReducer,
            rating: ratingReducer,
        },
        preloadedState: preloadedCart ? { cart: preloadedCart } : undefined,
    })
}