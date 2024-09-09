import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "./message.slice";
import AuthService from "../../services/auth.service";
import api from "../../config/api"; // Pour les appels API

const token = localStorage.getItem("token");
const refreshToken = localStorage.getItem("refresh_token");

const API_URL = process.env.REACT_APP_URL_BACK + "/api";

// Action pour obtenir l'utilisateur connecté via `createAsyncThunk`
export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, thunkAPI) => {
        try {
            const response = await api.get(API_URL + "/me"); // Appel direct à l'API
            return response.data;  // On retourne les données de l'utilisateur
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));  // Dispatch du message d'erreur
            return thunkAPI.rejectWithValue(message);  // Rejet de la promesse avec un message d'erreur
        }
    }
);

// Action pour le login
export const login = createAsyncThunk(
    "auth/login",
    async ({ username, password }, thunkAPI) => {
        try {
            const data = await AuthService.login(username, password);
            return { token: data.token, refreshToken: data.refresh_token };
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Action pour l'inscription (register)
export const register = createAsyncThunk(
    "auth/register",
    async ({ username, password, pseudo }, thunkAPI) => {
        try {
            const data = await AuthService.register(username, password, pseudo);
            return { token: data.token, refresh_token: data.refresh_token };
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.error) || 
                error.message ||
                error.toString();
            thunkAPI.dispatch(setMessage(message));
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Action pour la déconnexion
export const logout = createAsyncThunk("auth/logout", async () => {
    await AuthService.logout();
});

// État initial basé sur le token localStorage
const initialState = token
    ? { isLoggedIn: true, token, refreshToken }
    : { isLoggedIn: false, token: null, refreshToken: null };

// Création du slice pour auth
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
        },
        deleteToken: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("refresh_token");
            state.isLoggedIn = false;
            state.token = null;
            state.refreshToken = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refreshToken;
            })
            .addCase(login.rejected, (state) => {
                state.isLoggedIn = false;
                state.token = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoggedIn = true;
                state.token = action.payload.token;
                state.refreshToken = action.payload.refresh_token;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload; // Stocke les données de l'utilisateur
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoggedIn = false;
                state.token = null;
                state.refreshToken = null;
            });
    },
});

// Export des actions et du reducer
export const { reloadToken, deleteToken } = authSlice.actions;
export default authSlice.reducer;
