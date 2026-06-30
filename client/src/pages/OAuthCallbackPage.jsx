import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    apiClient
      .get("/api/auth/me")
      .then((res) => {
        login(token, res.data.user);
        navigate("/");
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500">Connexion en cours...</p>
    </div>
  );
}
