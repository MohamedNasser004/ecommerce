import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false,
    cartItems: [],
};

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {
        toggleCart: (state, action) => {
            state.isCartOpen = action.payload;
        },

        addItem: (state, action) => {
            const existingItem = state.cartItems.find(
                item => item.id === action.payload.id
            );

            if (existingItem) {
                existingItem.quantity++;
            } else {
                state.cartItems.push(action.payload);
            }
        },

        removeItem: (state, action) => {
            state.cartItems = state.cartItems.filter(
                item => item.id !== action.payload
            );
        },

        incrementItem: (state, action) => {
            const item = state.cartItems.find(
                item => item.id === action.payload
            );

            if (item) {
                item.quantity++;
            }
        },

        decrementItem: (state, action) => {
            const item = state.cartItems.find(
                item => item.id === action.payload
            );

            if (item && item.quantity > 1) {
                item.quantity--;
            }
        },
    },
});

export const {
    toggleCart,
    addItem,
    removeItem,
    incrementItem,
    decrementItem,
} = cartSlice.actions;

export default cartSlice.reducer;