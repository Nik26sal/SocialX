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
        setPosts: (state, action) => {
            state.posts = action.payload;
            state.status = 'succeeded';
        },
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
        },
        setError: (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        },
        setLoading: (state) => {
            state.status = 'loading';
        }
    },
});

export const { setPosts, addPost, removePost, clearPosts, setError, setLoading } = postSlice.actions;
export default postSlice.reducer;
