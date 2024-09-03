import api from '../config/api';

const API_URL = process.env.REACT_APP_URL_BACK + "/login_check";
const API_URL_REGISTER = process.env.APP_URL + "/register";
// const API_URL_REGISTER = "http://localhost:8741/register";

const login = (username, password) => {
    return api
        .post(API_URL, {
            username,
            password,
        })
        .then((response) => {
            if (response.data.token) {
                window.localStorage.setItem("token", response.data.token);
                window.localStorage.setItem("refresh_token", response.data.token);
            }

            return response.data;
        })
        .catch((e) => {
        if (e.response) {
          console.error("Response error:", e.response.data);
        } else if (e.request) {
          console.error("Request error:", e.request);
        } else {
          console.error("Error", e.message);
        }
      });
};

const register = (email, password, pseudo, username) => {
    return api
        .post(API_URL_REGISTER, {
            email,
            password,
            pseudo, 
            username
        })
        .then((response) => {
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
};

const authService = {
    login,
    logout,
    register
};

export default authService;