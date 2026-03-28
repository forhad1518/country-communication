import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api" || "https://192.168.0.105:3000/api" || "https://country-communication.vercel.app/api",
});