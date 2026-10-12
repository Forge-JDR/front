import api from '../config/api';

const saveSession = (data) => {
    if (!data.token || !data.refresh_token) {
        throw new Error("Réponse de connexion invalide.");
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("refresh_token", data.refresh_token);
    return data;
};

const login = async (username, password) => {
    const response = await api.post('/api/login_check', { username, password });
    return saveSession(response.data);
};

const register = async (username, password, pseudo) => {
    await api.post('/register', { username, password, pseudo });
    // Registration returns an access token only; login supplies a refresh token.
    try {
        return await login(username, password);
    } catch (error) {
        throw new Error("Compte créé. La connexion a échoué, veuillez vous connecter.");
    }
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
};

export default { login, logout, register };
