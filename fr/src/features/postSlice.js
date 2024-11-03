import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async actions for fetching, creating, liking, and unliking posts
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get('http://localhost:5555/user/userPosts');
    return response.data;  // Returns posts data from the server
});

export const createPost = createAsyncThunk('posts/createPost', async (postData) => {
    const response = await axios.post('http://localhost:5555/user/uploadPost', postData);
    return response.data;  // Returns created post data from the server
});

export const likePost = createAsyncThunk('posts/likePost', async (postId) => {
    const response = await axios.post(`http://localhost:5555/user/likesOnPost/${postId}`);
    return response.data;  // Returns user data who liked the post
});

export const unlikePost = createAsyncThunk('posts/unlikePost', async (postId) => {
    const response = await axios.post(`http://localhost:5555/user/unlikepost/${postId}`);
    return response.data;  // Returns user data who unliked the post
});

// Slice definition
const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],         // Array to store posts
        status: 'idle',    // Tracks API call status
        error: null        // Stores any error messages
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle successful fetchPosts action
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload.post;  // Replace posts array with fetched data
            })
            // Handle successful createPost action
            .addCase(createPost.fulfilled, (state, action) => {
                state.posts.push(action.payload.post);  // Add new post to posts array
            })
            // Handle successful likePost action
            .addCase(likePost.fulfilled, (state, action) => {
                const post = state.posts.find(post => post._id === action.meta.arg);  // Find post by ID
                if (post) post.Likes.push(action.payload.user._id);  // Add user ID to Likes
            })
            // Handle successful unlikePost action
            .addCase(unlikePost.fulfilled, (state, action) => {
                const post = state.posts.find(post => post._id === action.meta.arg);  // Find post by ID
                if (post) post.Likes = post.Likes.filter(userId => userId !== action.payload.user._id);  // Remove user ID from Likes
            });
    }
});

export default postSlice.reducer;
