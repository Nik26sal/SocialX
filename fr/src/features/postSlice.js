import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async actions for fetching, creating, liking, and deleting posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get('/api/getAllPost');
    return response.data;
});

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
    const response = await axios.post('/api/uploadPost', postData);
    return response.data;
});

export const likePost = createAsyncThunk('posts/likePost', async (postId) => {
    const response = await axios.post(`/api/likesOnPost/${postId}`);
    return response.data;
});

export const unlikePost = createAsyncThunk('posts/unlikePost', async (postId) => {
    const response = await axios.post(`/api/unlikepost/${postId}`);
    return response.data;
});

// Slice definition
const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload.post;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload.post);
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const post = state.posts.find(post => post._id === action.meta.arg);
                if (post) post.Likes.push(action.payload.user._id);
            })
            .addCase(unlikePost.fulfilled, (state, action) => {
                const post = state.posts.find(post => post._id === action.meta.arg);
                if (post) post.Likes = post.Likes.filter(userId => userId !== action.payload.user._id);
            });
    }
});

export default postSlice.reducer;
