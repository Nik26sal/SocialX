import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async actions for adding comments
export const addComment = createAsyncThunk('comments/addComment', async ({ postId, commentData }) => {
    const response = await axios.post(`/api/Comment/${postId}`, commentData);
    return response.data;
});

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        status: 'idle',
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addComment.fulfilled, (state, action) => {
                state.comments.push(action.payload.comment);
            });
    }
});

export default commentSlice.reducer;
