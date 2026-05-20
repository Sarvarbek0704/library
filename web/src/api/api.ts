import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export function getApiErrorMessage(err: any): string {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.response?.data ||
    err?.message;

  if (typeof msg === "string") return msg;
  try {
    return JSON.stringify(msg);
  } catch {
    return "Unknown error";
  }
}
