import { createSlice } from '@reduxjs/toolkit'

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        setAddressList: (state, action) => {
            state.list = action.payload || []
        },
        addAddress: (state, action) => {
            state.list.unshift(action.payload)
        },
        removeAddress: (state, action) => {
            state.list = state.list.filter((address) => address.id !== action.payload)
        },
    },
})

export const { setAddressList, addAddress, removeAddress } = addressSlice.actions

export default addressSlice.reducer