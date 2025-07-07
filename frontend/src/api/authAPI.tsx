import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
export const forgotPassword = (email: string) =>
    axios.post(`${BACKEND_URL}/auth/forgot-password`, { email });

export const resetPassword = (token: string, password: string) =>
    axios.patch(`${BACKEND_URL}/auth/reset-password/${token}`, { password });
