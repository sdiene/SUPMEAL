import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
export default function SettingsPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [diet, setDiet] = useState(user?.diet || "");
  const [allergies, setAllergies] = useState(user?.allergies || "");
  const [defaultPortions, setDefaultPortions] = useState(user?.defaultPortions || 4);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  async function handleProfileUpdate(e) {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess("");
    setProfileError("");
    try {
      await apiClient.patch("/api/users/me", { name, diet, allergies, defaultPortions });
      setProfileSuccess("Profil mis à jour avec succès !");
    } catch (err) {
      setProfileError(err.response?.data?.error || "Erreur serveur");
    } finally {
      setProfileLoading(false);
    }
  }
  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwLoading(true);
    setPwSuccess("");
    setPwError("");
    try {
      await apiClient.patch("/api/users/me/password", { currentPassword, newPassword });
      setPwSuccess("Mot de passe modifié avec succès !");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setPwError(err.response?.data?.error || "Erreur serveur");
    } finally {
      setPwLoading(false);
    }
  }
  async function handleDeleteAccount() {
    if (deleteConfirm !== "SUPPRIMER") {
      setDeleteError('Tapez exactement "SUPPRIMER" pour confirmer');
      return;
    }
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await apiClient.delete("/api/users/me");
      logout();
      navigate("/login");
    } catch (err) {
      setDeleteError(err.response?.data?.error || "Erreur serveur");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Paramètres</h1>

      {/* Profil */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Mon profil</h2>
        {profileSuccess && <p className="text-green-600 text-sm mb-3">{profileSuccess}</p>}
        {profileError && <p className="text-red-500 text-sm mb-3">{profileError}</p>}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Régime alimentaire</label>
            <input
              type="text"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              placeholder="ex. végétarien, sans gluten..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Allergies</label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="ex. arachides, lactose..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Portions par défaut</label>
            <input
              type="number"
              value={defaultPortions}
              onChange={(e) => setDefaultPortions(e.target.value)}
              min={1}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            disabled={profileLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {profileLoading ? "Enregistrement..." : "Sauvegarder"}
          </button>
        </form>
      </div>

      {/* Mot de passe */}
      {!user?.oauthProvider && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Changer le mot de passe</h2>
          {pwSuccess && <p className="text-green-600 text-sm mb-3">{pwSuccess}</p>}
          {pwError && <p className="text-red-500 text-sm mb-3">{pwError}</p>}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {pwLoading ? "Modification..." : "Changer le mot de passe"}
            </button>
          </form>
        </div>
      )}

      {/* Danger zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900 p-6">
        <h2 className="font-semibold text-red-600 mb-2">⚠️ Zone dangereuse</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          La suppression de votre compte est définitive et irréversible. Toutes vos recettes,
          cookbooks et données seront supprimés.
        </p>
        {deleteError && <p className="text-red-500 text-sm mb-3">{deleteError}</p>}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tapez <strong>SUPPRIMER</strong> pour confirmer
            </label>
            <input
              type="text"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="SUPPRIMER"
              className="w-full border border-red-300 dark:border-red-700 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {deleteLoading ? "Suppression..." : "🗑️ Supprimer mon compte"}
          </button>
        </div>
      </div>
    </div>
  );
}
