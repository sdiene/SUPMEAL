import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const token = searchParams.get("token");
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <p className="text-4xl mb-4">❌</p>
          <h1 className="text-xl font-bold text-gray-800 mb-4">Lien invalide</h1>
          <Link to="/forgot-password" className="text-red-600 hover:underline">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/api/auth/reset-password", { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur serveur");
    } finally {
      setLoading(false);
    }
  }
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <p className="text-4xl mb-4">✅</p>
          <h1 className="text-xl font-bold text-gray-800 mb-2">Mot de passe réinitialisé !</h1>
          <p className="text-gray-400 mb-2">Vous allez être redirigé vers la connexion...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Nouveau mot de passe</h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white rounded-lg py-2.5 font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}
