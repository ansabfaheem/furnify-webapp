import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  }
});

export const { setWishlist, clearWishlist } = wishlistSlice.actions;

// Thunks
export const loadWishlist = () => (dispatch, getState) => {
  const user = getState().auth.user;
  if (user) {
    const stored = localStorage.getItem(`wishlist_${user.id}`);
    if (stored) {
      dispatch(setWishlist(JSON.parse(stored)));
    } else {
      dispatch(setWishlist([]));
    }
  } else {
    dispatch(clearWishlist());
  }
};

export const toggleWishlist = (product) => (dispatch, getState) => {
  const user = getState().auth.user;
  if (!user) {
    alert("Please login to save items to your wishlist.");
    return;
  }

  const items = getState().wishlist.items;
  const exists = items.find(item => item.id === product.id);
  let newList;

  if (exists) {
    newList = items.filter(item => item.id !== product.id);
  } else {
    newList = [...items, product];
  }

  localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newList));
  dispatch(setWishlist(newList));
};

// Selectors
export const selectIsInWishlist = (state, productId) => {
  return state.wishlist.items.some(item => item.id === productId);
}

export default wishlistSlice.reducer;
