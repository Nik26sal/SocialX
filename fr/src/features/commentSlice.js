import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for adding a comment to a post
export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ postId, commentData }) => {
        const response = await axios.post(`http://localhost:5555/user/Comment/${postId}`, commentData);
        return response.data;  // Returns the newly added comment data from the server
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],         // Array to store comments
        status: 'idle',       // Tracks API call status
        error: null           // Stores any error messages
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Handle successful addComment action
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload.comment);  // Add new comment to comments array
            });
    }
});

export default commentSlice.reducer;
