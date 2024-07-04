import axiosInstance from "./api";
import { reloadToken, deleteToken } from '../store/slices/auth.slice'; 


const setup = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = window.localStorage.getItem("token");
            if (token) {
                config.headers["Authorization"] = 'Bearer ' + token;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    const { dispatch } = store;
    axiosInstance.interceptors.response.use(
        (res) => {
            return res;
        },
        async (err) => {
            console.log("Refresh");
            console.log(err);
            const originalConfig = err.config;
            const refreshToken = window.localStorage.getItem("refresh_token");
            console.log(refreshToken);
            if (originalConfig.url !== "/token/refresh" && err.response && refreshToken) {

                // Access Token was expired
                if (err.response.status === 401 && !originalConfig._retry) {
                    originalConfig._retry = true;


                    await axiosInstance.post('/token/refresh', {
                        "refresh_token": refreshToken,
                        "mode": "json"
                    }).then((response) => {

                            dispatch(reloadToken({
                                token: response.data.data.token,
                                refreshToken: response.data.data.refresh_token
                            }));

                        }
                    ).catch((error) => {
                        dispatch(deleteToken());
                    });

                    return axiosInstance(originalConfig);
                }
            }

            return Promise.reject(err);
        }
    );
};

export default setup;