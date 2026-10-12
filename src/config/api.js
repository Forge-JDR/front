import axios from 'axios';

// REACT_APP_URL_BACK is the backend origin, without the /api suffix.
const instance = axios.create({
    withCredentials: false,
    baseURL: process.env.REACT_APP_URL_BACK,
});

export default instance;
