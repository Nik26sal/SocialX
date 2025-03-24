import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
    user: Cookies.get('User') ? JSON.parse(Cookies.get('User')) : null,
    isAuthenticated: Cookies.get('isAuthenticated') ? JSON.parse(Cookies.get('isAuthenticated')) : false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            Cookies.set('User', JSON.stringify(action.payload.user));
            Cookies.set('isAuthenticated', JSON.stringify(true));
        },
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            Cookies.remove('User');
            Cookies.remove('isAuthenticated');
        }
    }
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
