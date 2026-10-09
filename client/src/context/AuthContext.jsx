import { createContext, useEffect, useState } from "react";
import api from "../utils/Axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (err) {
        console.error("Failed to parse local userInfo:", err);
        localStorage.removeItem("userInfo");
      }
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      // FIX: Direct data nahi, data.user object extract karein
      const userData = data.user || data;

      setUser(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      return data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      // FIX: Backend response se user object extract karein
      const userData = data.user || data;

      setUser(userData);
      localStorage.setItem("userInfo", JSON.stringify(userData));
      localStorage.setItem("token", data.token);

      return userData; // Updated user return kar rahe hain redirection ke liye
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};