import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        <p className="text-4xl mb-4"><FontAwesomeIcon icon={faCircleCheck} /></p>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Email vérifié avec succès !</h1>
        <p className="text-gray-400 mb-6">Votre compte est maintenant actif. Vous pouvez vous connecter.</p>
        <Link
          to="/login"
          className="inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
