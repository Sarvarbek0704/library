import axios from "axios";

export const API_BASE = "http://localhost:3000"; // o'zingniki bo'lsa almashtir

export const http = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  // token qayerda bo'lsa shu keyni yozasan
  const token = localStorage.getItem("token"); // masalan: "token"
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
