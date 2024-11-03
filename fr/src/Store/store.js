import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import postReducer from '../features/postSlice.js';
import commentReducer from '../features/commentSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        comments: commentReducer
    }
});

export default store;
