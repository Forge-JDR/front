import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message.slice";
import { Navigate } from "react-router-dom";

import AuthService from "../../services/auth.service";

const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refresh_token");

export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }, thunkAPI) => {
        try {
            const data = await AuthService.login(username, password);
            return { token: data };
        } catch (error) {
            
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async ({ email, password, username, pseudo }, thunkAPI) => {
        try {
            await AuthService.register(email, password, username, pseudo);
        } catch (error) {
            
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue();
        }
    }
);


export const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();
});


const initialState = token
    ? { isLoggedIn: true, token, refreshToken }
    : { isLoggedIn: false, token: null, refreshToken };


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reloadToken: (state, action) => {
            state.token = action.payload.token;
            state.refreshToken = action.payload.refresh_token;
            state.isLoggedIn = true;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("refresh_token", action.payload.refresh_token);
            return state;
        },
        deleteToken: (state, action ) => {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            state.isLoggedIn = false;
            state.token = null;
            state.refreshToken = null;
            return state;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refresh_token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoggedIn = false;
                state.token = null;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = false;
                state.token = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                console.log("register done !");
            });
    },
});

export const { reloadToken, deleteToken } = authSlice.actions;

const { reducer } = authSlice;
export default reducer;