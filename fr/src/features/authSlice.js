import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    user: Cookies.get('User') || null,
    isAuthenticated: !!Cookies.get('User'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            Cookies.set('User', action.payload.user);
        },
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            Cookies.remove('User');
        }
    }
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
