import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../Helpers/axiosInstance";
import { toast } from 'react-hot-toast'

const initialState = {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    data: localStorage.getItem('data') || {},
    role: localStorage.getItem('role') || ''
};

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

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
});

export default authSlice.reducer;