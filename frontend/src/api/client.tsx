import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const client = axios.create({
    baseURL: 'BACKEND_URL', // Change to your API base URL
    // You can add headers or other config here
});

export default client;