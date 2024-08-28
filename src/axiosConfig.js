// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/', // Change to your backend URL and port
});

export default axiosInstance;
