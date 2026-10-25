import { createSlice } from '@reduxjs/toolkit'

const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload || []
        },
        addRating: (state, action) => {
            const index = state.ratings.findIndex(
                (r) => r.userId === action.payload.userId && r.productId === action.payload.productId && r.orderId === action.payload.orderId
            )
            if (index >= 0) {
                state.ratings[index] = action.payload
            } else {
                state.ratings.push(action.payload)
            }
        },
    },
})

export const { setRatings, addRating } = ratingSlice.actions

export default ratingSlice.reducer