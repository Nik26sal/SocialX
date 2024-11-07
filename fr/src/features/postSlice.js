import { createSlice } from '@reduxjs/toolkit';

const savedPosts = JSON.parse(localStorage.getItem('posts')) || [];

const initialState = {
    posts: savedPosts,
    status: 'idle',
    error: null 
};

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);
            localStorage.setItem('posts', JSON.stringify(state.posts));
        },
        removePost: (state, action) => {
            state.posts = state.posts.filter(post => post._id !== action.payload);
            localStorage.setItem('posts', JSON.stringify(state.posts));
        },
        clearPosts: (state) => {
            state.posts = [];
            localStorage.removeItem('posts');
        }
    },
});

export const { addPost, removePost, clearPosts } = postSlice.actions;
export default postSlice.reducer;
