import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice.js';
import postReducer from '../features/postSlice.js';

const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer
    }
});

export default store;
