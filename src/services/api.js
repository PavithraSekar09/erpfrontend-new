import axios from "axios";

const API = axios.create({
  baseURL: "https://erp-backend-4-9jw8.onrender.com/api"
});

// ✅ Auto attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;