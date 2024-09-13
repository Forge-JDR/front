import api from '../config/api';

const API_URL_LOGIN = process.env.REACT_APP_URL_BACK + "/api/login_check";
const API_URL_REGISTER = process.env.REACT_APP_URL_BACK + "/register";

const login = (username, password) => {
    return api
        .post(API_URL_LOGIN, {
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

const register = (username, password, pseudo) => {
    return api
        .post(API_URL_REGISTER, {
            username,
            password,
            pseudo
        })
        .then((response) => {
            const data = response.data;
            if (data.token) {
                window.localStorage.setItem("token", data.token);
            }
            return data;
        })
        .catch((error) => {
            if (error.response) {
                console.error("Response error:", error.response.data);
                throw new Error(error.response.data.error);  // On jette une erreur avec un message clair
            } else if (error.request) {
                console.error("Request error:", error.request);
                throw new Error("Erreur de requête : pas de réponse du serveur.");
            } else {
                console.error("Error", error.message);
                throw new Error("Erreur lors de l'inscription.");
            }
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