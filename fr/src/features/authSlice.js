
import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('user'));
const savedAccessToken = localStorage.getItem('accessToken');
const savedRefreshToken = localStorage.getItem('refreshToken');

const initialState = {
    user: savedUser || null,
    accessToken: savedAccessToken || null,
    refreshToken: savedRefreshToken || null,
    isAuthenticated: !!savedUser && !!savedAccessToken,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
