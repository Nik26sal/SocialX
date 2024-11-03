import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async actions for user registration, login, and logout
export const registerUser = createAsyncThunk('auth/registerUser', async (userData) => {
    const response = await axios.post('http://localhost:5555/user/register', userData);
    return response.data;
});

export const loginUser = createAsyncThunk('auth/loginUser', async (userData) => {
    const response = await axios.post('http://localhost:5555/user/login', userData);
    return response.data;
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    const response = await axios.post('http://localhost:5555/user/logout');
    return response.data;
});

// Slice definition
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        status: 'idle',
        error: null
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
        },
        clearAuth: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle registerUser action fulfilled
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.status = 'succeeded';
            })
            // Handle loginUser action fulfilled
            .addCase(loginUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.isAuthenticated = true;
            })
            // Handle logoutUser action fulfilled
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
            });
    }
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
