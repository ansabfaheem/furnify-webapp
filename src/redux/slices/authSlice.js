import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const getUserFromLocalStorage = () => {
  const storedUser = localStorage.getItem('furnify_user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userData = await api.login(email, password);
      if (userData) {
        localStorage.setItem('furnify_user', JSON.stringify(userData));
        return userData;
      }
      return rejectWithValue('Invalid email or password');
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const newUser = await api.register({ name, email, password });
      localStorage.setItem('furnify_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: getUserFromLocalStorage(),
  loading: false, // Initialized from localStorage synchronously, so no initial loading needed usually
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('furnify_user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
