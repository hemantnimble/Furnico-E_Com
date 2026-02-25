import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
    id: string;
    title: string;
    price: number;
    stock: number;
    images: string[];
    category: string;
}

export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    quantity: number;
    product: Product;
    createdAt?: string;
    updatedAt?: string;
}

interface CartState {
    cartItems: CartItem[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CartState = {
    cartItems: [],
    status: 'idle',
    error: null,
};

export const fetchCartItems = createAsyncThunk(
    'cart/fetchCartItems',
    async () => {
        const response = await axios.get<{ cartItems: CartItem[] }>('/api/cart/get');
        return response.data.cartItems;
    }
);

export const addCartItem = createAsyncThunk(
    'cart/addCartItem',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await axios.post<{ adCart: CartItem }>('/api/cart/add', { productId, quantity: 1 });
            return response.data.adCart;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to add item to cart');
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ id, quantity }: { id: string; quantity: number }, { rejectWithValue }) => {
        try {
            await axios.post('/api/cart/update', { id, quantity });
            return { id, quantity };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update item');
        }
    }
);

export const removeCartItem = createAsyncThunk(
    'cart/removeCartItem',
    async (cartItemId: string, { rejectWithValue }) => {
        try {
            await axios.post(`/api/cart/remove`, { id: cartItemId });
            return cartItemId;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to remove item from cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ── Fetch ──────────────────────────────────────────────────────────
            .addCase(fetchCartItems.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCartItems.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
                state.status = 'succeeded';
                state.cartItems = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Failed to fetch cart items';
            })

            // ── Add ────────────────────────────────────────────────────────────
            // Don't set global loading for add either — avoids full page spinner
            .addCase(addCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
                const existingItem = state.cartItems.find((item) => item.product.id === action.payload.product.id);
                if (existingItem) {
                    existingItem.quantity = action.payload.quantity;
                } else {
                    state.cartItems.push(action.payload);
                }
            })
            .addCase(addCartItem.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to add item to cart';
            })

            // ── Update — NO global status change, just mutate the item ─────────
            .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<{ id: string; quantity: number }>) => {
                const item = state.cartItems.find((i) => i.id === action.payload.id);
                if (item) {
                    item.quantity = action.payload.quantity;
                }
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to update cart item';
            })

            // ── Remove — NO global status change, just filter out the item ─────
            .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<string>) => {
                state.cartItems = state.cartItems.filter((item) => item.id !== action.payload);
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                state.error = action.payload as string || 'Failed to remove item from cart';
            });
    },
});

export default cartSlice.reducer;