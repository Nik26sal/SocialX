import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for adding a comment to a post
export const addComment = createAsyncThunk(
    'comments/addComment',
    async ({ postId, commentData }) => {
        const response = await axios.post(`http://localhost:5555/user/Comment/${postId}`, commentData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } // Include token for authorization
        });
        return response.data; // Returns the newly added comment data from the server
    }
);

// Initial state for the comments slice
const initialState = {
    comments: [], // Array to store comments
    status: 'idle', // Tracks API call status (idle, loading, succeeded, failed)
    error: null // Stores any error messages
};

// Slice definition
const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        // Optionally, you can add synchronous reducers here if needed in the future
    },
    extraReducers: (builder) => {
        builder
            // Handle successful addComment action
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload.comment); // Add new comment to comments array
                state.status = 'succeeded'; // Update status to succeeded
                state.error = null; // Reset error on success
            })
            .addCase(addComment.rejected, (state, action) => {
                state.status = 'failed'; // Update status to failed
                state.error = action.error.message; // Capture error message
            });
    },
});

// Export actions and reducer
export default commentSlice.reducer;
