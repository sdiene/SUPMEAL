import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import apiClient from "../api/client";
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }
    apiClient
      .get(`/api/auth/verify-email?token=${token}`)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {status === "loading" && <p className="text-gray-400">Vérification en cours...</p>}
        {status === "success" && (
          <>
            <p className="text-4xl mb-4">✅</p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Email vérifié !</h1>
            <p className="text-gray-400 mb-6">Votre compte est maintenant actif.</p>
            <Link
              to="/login"
              className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Se connecter
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-4xl mb-4">❌</p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Lien invalide ou expiré</h1>
            <p className="text-gray-400 mb-6">Le lien de vérification est invalide ou a expiré (24h).</p>
            <Link
              to="/register"
              className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              S'inscrire à nouveau
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
