import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    post:localStorage.getItem('post') || [],
};

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        post: (state, action) => {
            state.post = action.payload.post;
            localStorage.setItem('post', action.payload.post); 
        },
        removePost: (state) => {
            state.post = [];
            localStorage.removeItem('post');
        }
    }
});

export const { post, removePost } = postSlice.actions;
export default postSlice.reducer;
