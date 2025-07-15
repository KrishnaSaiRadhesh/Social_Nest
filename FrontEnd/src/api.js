// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true, // Send cookies
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log
    if (!token) {
      const cookie = document.cookie.split("; ").find((row) => row.startsWith("token="));
      token = cookie?.split("=")[1];
      console.log("Token from cookie:", token); // Debug log
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers.Authorization); // Debug log
    } else {
      console.log("No token available"); // Debug log
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;