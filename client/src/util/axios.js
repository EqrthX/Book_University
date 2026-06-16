import axios from "axios";

const baseURL = import.meta.env.VITE_URL_SERVER || import.meta.env.VITE_URL || "http://localhost:5001/api";

export const SERVER_URL = baseURL.replace(/\/api$/, "");

const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // เปิดใช้งาน cookie
})

export default instance