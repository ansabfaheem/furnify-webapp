import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const loadCartAsync = createAsyncThunk(
  'cart/loadCart',
  async (userId, { rejectWithValue }) => {
    try {
      let userCart = await api.getCart(userId);
      if (!userCart) {
        userCart = await api.createCart(userId);
      }
      return { cartId: userCart.id, items: userCart.items || [] };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// We need cartId to update cart remotely, so we get it from getState
export const addToCartAsync = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      const { cartId, items } = getState().cart;
      if (!cartId) return rejectWithValue('No cart initialized');

      const existingItem = items.find(item => item.productId === product.id);
      let newItems;

      if (existingItem) {
        newItems = items.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...items, { productId: product.id, quantity, product }];
      }

      await api.updateCart(cartId, newItems);
      return newItems;
    } catch (error) {
       return rejectWithValue(error.message);
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const { cartId, items } = getState().cart;
      const newItems = items.filter(item => item.productId !== productId);
      await api.updateCart(cartId, newItems);
      return newItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, delta }, { getState, rejectWithValue }) => {
    try {
      const { cartId, items } = getState().cart;
      const newItems = items.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      });
      await api.updateCart(cartId, newItems);
      return newItems;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    try {
       const { cartId } = getState().cart;
       if (cartId) {
         await api.updateCart(cartId, []);
       }
       return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  cartId: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.cartId = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCartAsync.pending, (state) => { state.loading = true; })
      .addCase(loadCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.cartId = action.payload.cartId;
      })
      .addCase(loadCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = [];
      });
  }
});

export const { clearCartState } = cartSlice.actions;

// Selectors
export const selectCartTotal = (state) => 
  state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

export const selectCartCount = (state) => 
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;
