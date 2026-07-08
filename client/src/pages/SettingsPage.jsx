import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
import { importRecipes } from "../api/recipes";
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
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importSuccess, setImportSuccess] = useState("");
  const [importError, setImportError] = useState("");
  const fileRef = useRef(null);

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

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    setImportLoading(true);
    setImportError("");
    setImportSuccess("");

    try {
      const text = await file.text();
      const isCSV = file.name.endsWith(".csv");

      let result;
      if (isCSV) {
        result = await importRecipes("csv", text);
      } else {
        const json = JSON.parse(text);
        result = await importRecipes("json", json);
      }

      setImportSuccess(`✅ ${result.data.imported} recette(s) importée(s) avec succès !`);
    } catch (err) {
      setImportError(err.response?.data?.error || "Fichier invalide ou erreur serveur");
    } finally {
      setImportLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer votre compte ?\n\nCette action est irréversible. Toutes vos recettes et données seront définitivement supprimées."
    );
    if (!confirmed) return;

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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🥗 Régime alimentaire
              <span className="text-xs text-gray-400 font-normal ml-2">
                (utilisé pour filtrer les recettes incompatibles)
              </span>
            </label>
            <select
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Aucun régime spécifique</option>
              <option value="végétarien">🌿 Végétarien</option>
              <option value="vegan">🌱 Vegan</option>
              <option value="sans gluten">🌾 Sans gluten</option>
              <option value="halal">☪️ Halal</option>
              <option value="kasher">✡️ Kasher</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ⚠️ Allergies
              <span className="text-xs text-gray-400 font-normal ml-2">
                (séparées par virgules — des alertes apparaîtront sur les recettes concernées)
              </span>
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="ex. arachides, lactose, gluten, noix..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {allergies && (
              <div className="flex gap-2 flex-wrap mt-2">
                {allergies.split(",").map((a) => a.trim()).filter(Boolean).map((a) => (
                  <span key={a} className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-1 rounded-full">
                    ⚠️ {a}
                  </span>
                ))}
              </div>
            )}
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

      {/* Import / Export */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-1">📦 Import / Export</h2>
        <p className="text-xs text-gray-400 mb-4">
          Exportez vos recettes en JSON ou CSV. Importez des recettes depuis un fichier compatible.
        </p>

        {/* Export */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Exporter mes recettes</h3>
          <div className="flex gap-3">
            <a
              href={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/export?format=json`}
              onClick={(e) => {
                e.preventDefault();
                if (!window.confirm("Vos données seront exportées en clair (lisibles). Continuer ?")) return;
                const token = localStorage.getItem("token");
                fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/export?format=json`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
                .then(r => r.blob())
                .then(blob => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "supmeal-recipes.json";
                  a.click();
                  URL.revokeObjectURL(url);
                });
              }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              ⬇️ Export JSON
            </a>
            
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (!window.confirm("Vos données seront exportées en clair (lisibles). Continuer ?")) return;
                const token = localStorage.getItem("token");
                fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/export?format=csv`, {
                  headers: { Authorization: `Bearer ${token}` }
                })
                .then(r => r.blob())
                .then(blob => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "supmeal-recipes.csv";
                  a.click();
                  URL.revokeObjectURL(url);
                });
              }}
              className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              ⬇️ Export CSV
            </a>
          </div>
        </div>

        {/* Import */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Importer des recettes</h3>
          <p className="text-xs text-gray-400 mb-3">Formats acceptés : JSON ou CSV (compatibles SUPMEAL)</p>

          {importSuccess && <p className="text-green-600 text-sm mb-3">{importSuccess}</p>}
          {importError && <p className="text-red-500 text-sm mb-3">{importError}</p>}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              ref={fileRef}
              type="file"
              accept=".json,.csv"
              onChange={handleImport}
              disabled={importLoading}
              className="hidden"
            />
            <span className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              importLoading
                ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700 cursor-pointer"
            }`}>
              {importLoading ? "Import en cours..." : "⬆️ Importer un fichier"}
            </span>
            <span className="text-xs text-gray-400">
              Les recettes importées seront ajoutées à vos recettes personnelles
            </span>
          </label>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900 p-6">
        <h2 className="font-semibold text-red-600 mb-2">⚠️ Zone dangereuse</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          La suppression de votre compte est définitive et irréversible. Toutes vos recettes,
          cookbooks et données seront supprimés.
        </p>
        {deleteError && <p className="text-red-500 text-sm mb-3">{deleteError}</p>}
        <button
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
        >
          {deleteLoading ? "Suppression..." : "🗑️ Supprimer mon compte"}
        </button>
      </div>
    </div>
  );
}