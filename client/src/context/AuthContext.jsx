import { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/client";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  async function fetchMe() {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await apiClient.get("/api/auth/me");
      setUser(res.data.user);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchMe();
  }, []);
  function login(token, userData) {
    localStorage.setItem("token", token);
    setUser(userData);
  }
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
