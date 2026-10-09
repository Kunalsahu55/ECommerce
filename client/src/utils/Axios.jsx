import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
});

api.interceptors.request.use(
  (config) => {
    // FIX: Direct "token" key se nikalen (kyunki AuthContext me token key se save ho raha hai)
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;