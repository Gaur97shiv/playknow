import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Dummy async function simulating API call to get auth user
export const fetchAuthUser = createAsyncThunk(
  'auth/fetchAuthUser',
  async (_, thunkAPI) => {
    try {
      // Replace this with real API call like axios.get('/api/user')
      const user = JSON.parse(localStorage.getItem('user')); // for example purpose
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAuthUser, logoutAuthUser } = authSlice.actions;
export default authSlice.reducer;
