import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: [],
    status: 'idle',
    error: null 
};
const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
        },
    },
});
export const {  addPost, removePost } = postSlice.actions;
export default postSlice.reducer;
