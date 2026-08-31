import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();
  const called = useRef(false);
  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      return;
    }
    apiClient
      .get("/api/auth/verify-email?token=" + token)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch(() => setStatus("error"));
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        {status === "loading" && (
          <p className="text-gray-400">Vérification en cours...</p>
        )}
        {status === "success" && (
          <>
            <p className="text-4xl mb-4"><FontAwesomeIcon icon={faCircleCheck} /></p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Email vérifié !</h1>
            <p className="text-gray-400 mb-2">Votre compte est maintenant actif.</p>
            <p className="text-sm text-gray-400">Redirection vers la connexion...</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-4xl mb-4"><FontAwesomeIcon icon={faCircleXmark} /></p>
            <h1 className="text-xl font-bold text-gray-800 mb-2">Lien invalide ou expiré</h1>
            <p className="text-gray-400 mb-6">
              Le lien de vérification est invalide ou a expiré (24h).
            </p>
            <Link
              to="/register"
              className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              S'inscrire à nouveau
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
