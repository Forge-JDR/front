import axios from 'axios';

const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.REACT_APP_URL_BACK,
    token: localStorage.getItem('token'),
});

export default instance;