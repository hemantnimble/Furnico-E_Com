import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Review {
    id: string;
    content: string;
    rating: number;
    productId: string;
    userId: string;
    createdAt: string;
}

export interface Product {
    id: string;
    title: string;
    price: number;
    stock: number;
    images: string[];
    category: string;
    description?: string;   // ← NEW
    model3dUrl?: string;    // ← NEW
    reviews?: Review[];
}

interface ProductState {
    items: Product[];
    singleProduct: Product | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProductState = {
    items: [],
    singleProduct: null,
    status: 'idle',
    error: null,
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (category: string) => {
        const response = await axios.post<{ products: Product[] }>('/api/products/filter', { category });
        return response.data.products;
    }
);

export const fetchSingleProduct = createAsyncThunk(
    'products/fetchSingleProduct',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await axios.post<{ product: Product }>('/api/products/getsingleproduct', { id: productId });
            return response.data.product;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to fetch product');
        }
    }
);

export const addProduct = createAsyncThunk(
    'products/addProduct',
    async (newProduct: any, { rejectWithValue }) => {
        try {
            const response = await axios.post<Product>('/api/products/add', newProduct);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to add product');
        }
    }
);

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async (updatedProduct: Product, { rejectWithValue }) => {
        try {
            const response = await axios.put<Product>(`/api/products/update`, updatedProduct);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to update product');
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id: any, { rejectWithValue }) => {
        try {
            await axios.post('/api/products/delete', { id });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Failed to delete product');
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch products';
            })

            .addCase(fetchSingleProduct.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchSingleProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.status = 'succeeded';
                state.singleProduct = action.payload;
            })
            .addCase(fetchSingleProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Failed to fetch product';
            })

            .addCase(addProduct.pending, (state) => { state.status = 'loading'; })
            .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.status = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Failed to add product';
            })

            .addCase(updateProduct.pending, (state) => { state.status = 'loading'; })
            .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
                state.status = 'succeeded';
                const index = state.items.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Failed to update product';
            })

            .addCase(deleteProduct.pending, (state) => { state.status = 'loading'; })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
                state.status = 'succeeded';
                state.items = state.items.filter((p) => p.id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Failed to delete product';
            });
    },
});

export default productSlice.reducer;