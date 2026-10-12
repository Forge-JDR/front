import axiosInstance from "./api";
import { reloadToken, deleteToken } from '../store/slices/auth.slice';

const setup = (store) => {
    let refreshPromise = null;
    const requestId = axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        config.headers = config.headers || {};
        if (token) config.headers.Authorization = 'Bearer ' + token;
        else delete config.headers.Authorization;
        return config;
    });

    const responseId = axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const config = error.config;
            const isAuthRequest = /\/(?:register|api\/(?:login_check|token\/refresh))(?:\?|$)/.test(config?.url || "");
            if (!config || error.response?.status !== 401 || isAuthRequest) {
                return Promise.reject(error);
            }
            if (config._retry) {
                store.dispatch(deleteToken());
                return Promise.reject(error);
            }
            const refreshToken = localStorage.getItem("refresh_token");
            if (!refreshToken) {
                store.dispatch(deleteToken());
                return Promise.reject(error);
            }
            config._retry = true;
            const currentToken = localStorage.getItem("token");
            // A delayed 401 may arrive after another request already refreshed.
            if (currentToken && config.headers?.Authorization !== 'Bearer ' + currentToken) {
                return axiosInstance(config);
            }
            if (!refreshPromise) {
                refreshPromise = axiosInstance.post('/api/token/refresh', {
                    refresh_token: refreshToken,
                }).then(({ data }) => {
                    if (!data.token || !data.refresh_token) {
                        throw new Error("Réponse de renouvellement invalide.");
                    }
                    if (localStorage.getItem("refresh_token") !== refreshToken) {
                        throw new Error("La session a changé pendant le renouvellement.");
                    }
                    store.dispatch(reloadToken(data));
                }).catch((refreshError) => {
                    if (localStorage.getItem("refresh_token") === refreshToken) {
                        store.dispatch(deleteToken());
                    }
                    throw refreshError;
                }).finally(() => { refreshPromise = null; });
            }
            await refreshPromise;
            return axiosInstance(config);
        }
    );
    return () => {
        axiosInstance.interceptors.request.eject(requestId);
        axiosInstance.interceptors.response.eject(responseId);
    };
};

export default setup;
