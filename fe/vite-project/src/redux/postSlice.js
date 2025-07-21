// redux/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ feedType, username, userId }, thunkAPI) => {
    let endpoint = "http://localhost:5000/api/posts/all";
    switch (feedType) {
      case "following":
        endpoint = "http://localhost:5000/api/posts/following";
        break;
      case "posts":
        endpoint = `http://localhost:5000/api/posts/user/${username}`;
        break;
      case "likes":
        endpoint = `http://localhost:5000/api/posts/likes/${userId}`;
        break;
    }

    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Something went wrong");
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Something went wrong");
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ text, img }, thunkAPI) => {
    try {
      const res = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, img }),
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Something went wrong");
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Something went wrong");
    }
  }
);

export const editPost = createAsyncThunk(
  'posts/editPost',
  async ({ id, text, img }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, img }),
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Something went wrong");
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Something went wrong");
      }
      return postId;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const commentPost = createAsyncThunk(
  'posts/commentPost',
  async ({ postId, comment }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Something went wrong");
      }
      return { postId, comment: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (postId, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/like/${postId}`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        return thunkAPI.rejectWithValue(data.error || "Something went wrong");
      }
      return { postId, likes: data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    loading: false,
    error: null,
    editingPost: null,
  },
  reducers: {
    setPosts(state, action) {
      state.posts = action.payload;
    },
    setEditingPost(state, action) {
      state.editingPost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.posts.findIndex((p) => p._id === updated._id);
        if (index !== -1) state.posts[index] = updated;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(commentPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) post.comments.push(comment);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const { postId, likes } = action.payload;
        const post = state.posts.find((p) => p._id === postId);
        if (post) post.likes = likes;
      });
  },
});

export const { setPosts, setEditingPost } = postSlice.actions;
export default postSlice.reducer;