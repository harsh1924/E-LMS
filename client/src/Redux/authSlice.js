import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Helpers/axiosInstance";
import { toast } from 'react-hot-toast'

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    data: localStorage.getItem('data') || {},
    role: localStorage.getItem('role') || ''
};

// SIGNUP FUNCTION
export const createAccount = createAsyncThunk('auth/signup', async (data) => {
    try {
        let res = axiosInstance.post('user/signup', data);
        toast.promise(res, {
            loading: 'Wait! Creating Your Account',
            success: 'Your Account Has Been Created',
            error: 'Failed to create account'
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

// LOGIN FUNCTION
export const login = createAsyncThunk('auth/login', async (data) => {
    try {
        let res = axiosInstance.post('/user/login', data);
        await toast.promise(res, {
            loading: 'Loading....',
            success: 'User Has Been Logged In Successfully',
            error: 'Failed to Login In',
        });
        return (await res).data;
    } catch (error) {
        toast.error(error.message)
    }
});

// LOGOUT FUNCTION
export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        let res = axiosInstance.post('/user/logout');
        await toast.promise(res, {
            loading: 'Loading...',
            success: 'User Logged Out Successfully',
            error: 'Failed to Logout'
        });
        return (await res).data;
    } catch (error) {
        toast.error(error.message);
    }
});

// FUNCTION TO FETCH USER DETAILS
export const getUserData = createAsyncThunk('user/details', async () => {
    try {
        const res = await axiosInstance.get('/user/me');
        return (await res).data;
    } catch (error) {
        toast.error(error.message);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // for LOGIN
            .addCase(login.fulfilled, (state, action) => {
                localStorage.setItem('data', JSON.stringify(action?.payload?.user));
                localStorage.setItem('isLoggedIn', true);
                localStorage.setItem('role', action?.payload?.user?.role);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            })
            // for LOGOUT
            .addCase(logout.fulfilled, (state) => {
                localStorage.clear();
                state.isLoggedIn = false;
                state.data = {};
                state.role = ''
            })
            .addCase(getUserData.fulfilled, (state, action) => {
                localStorage.setItem('data', JSON.stringify(action?.payload?.user));
                localStorage.setItem('isLoggedIn', true);
                state.isLoggedIn = true;
                state.data = action?.payload?.user;
                state.role = action?.payload?.user?.role;
            })
    }
});

export default authSlice.reducer;