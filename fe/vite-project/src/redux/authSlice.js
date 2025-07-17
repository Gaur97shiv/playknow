import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchAuthUser = createAsyncThunk(
  'auth/fetchAuthUser',
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    logoutAuthUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setAuthUser, logoutAuthUser } = authSlice.actions;
export default authSlice.reducer;
