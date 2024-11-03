import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunks for post actions
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get('http://localhost:5555/user/userPosts');
    return response.data; // Returns posts data from the server
});

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
    const response = await axios.post('http://localhost:5555/user/uploadPost', postData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    return response.data; // Returns created post data from the server
});

export const likePost = createAsyncThunk('posts/likePost', async (postId) => {
    const response = await axios.post(`http://localhost:5555/user/likesOnPost/${postId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    return response.data; // Returns updated post data with likes
});

export const unlikePost = createAsyncThunk('posts/unlikePost', async (postId) => {
    const response = await axios.post(`http://localhost:5555/user/unlikepost/${postId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    });
    return response.data; // Returns updated post data with likes
});

// Initial state for the posts slice
const initialState = {
    posts: [], // Array to store posts
    status: 'idle', // Tracks API call status
    error: null // Stores any error messages
};

// Slice definition
const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        // Optionally, you can add synchronous reducers here for additional functionalities.
    },
    extraReducers: (builder) => {
        // Handle successful fetchPosts action
        builder
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload.post; // Replace posts array with fetched data
                state.status = 'succeeded'; // Update status
                state.error = null; // Reset error on success
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'; // Update status
                state.error = action.error.message; // Capture error message
            })
            // Handle successful createPost action
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload.post); // Add new post to posts array
                state.status = 'succeeded'; // Update status
                state.error = null; // Reset error on success
            })
            .addCase(createPost.rejected, (state, action) => {
                state.status = 'failed'; // Update status
                state.error = action.error.message; // Capture error message
            })
            // Handle successful likePost action
            .addCase(likePost.fulfilled, (state, action) => {
                const postIndex = state.posts.findIndex(post => post._id === action.payload.post._id); // Find post index by ID
                if (postIndex >= 0) {
                    state.posts[postIndex] = action.payload.post; // Update the post with new likes data
                }
                state.status = 'succeeded'; // Update status
                state.error = null; // Reset error on success
            })
            .addCase(likePost.rejected, (state, action) => {
                state.status = 'failed'; // Update status
                state.error = action.error.message; // Capture error message
            })
            // Handle successful unlikePost action
            .addCase(unlikePost.fulfilled, (state, action) => {
                const postIndex = state.posts.findIndex(post => post._id === action.payload.post._id); // Find post index by ID
                if (postIndex >= 0) {
                    state.posts[postIndex] = action.payload.post; // Update the post with new likes data
                }
                state.status = 'succeeded'; // Update status
                state.error = null; // Reset error on success
            })
            .addCase(unlikePost.rejected, (state, action) => {
                state.status = 'failed'; // Update status
                state.error = action.error.message; // Capture error message
            });
    },
});

// Export actions and reducer
export default postSlice.reducer;
