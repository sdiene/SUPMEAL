import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCookbooks, createCookbook } from "../api/cookbooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBook, faUsers } from "@fortawesome/free-solid-svg-icons";
export default function CookbooksPage() {
  const [cookbooks, setCookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [cbSearch, setCbSearch] = useState("");
  useEffect(() => {
    getCookbooks()
      .then((res) => setCookbooks(res.data.cookbooks))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const res = await createCookbook({ name, description });
      setCookbooks((prev) => [res.data.cookbook, ...prev]);
      setName("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  }
  if (loading) return <p className="text-gray-400">Chargement...</p>;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mes cookbooks</h1>
          <p className="text-gray-400 text-sm mt-1">{cookbooks.length} cookbook{cookbooks.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} /> Nouveau cookbook
        </button>
      </div>
      {/* Formulaire création */}
      {showForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6 space-y-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200">Créer un cookbook</h2>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? "Création..." : "Créer"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
            >
              Annuler
            </button>
          </div>
        </form>
      )}
      {/* Recherche */}
      {cookbooks.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={cbSearch}
            onChange={(e) => setCbSearch(e.target.value)}
            placeholder="Rechercher un cookbook..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      )}

      {/* Liste */}
      {cookbooks.filter((cb) =>
        cb.name.toLowerCase().includes(cbSearch.toLowerCase()) ||
        (cb.description || "").toLowerCase().includes(cbSearch.toLowerCase())
      ).length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-4xl mb-3"><FontAwesomeIcon icon={faBook} /></p>
          <p className="text-gray-400">Aucun cookbook pour l'instant</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {cookbooks.map((cb) => (
            <Link
              key={cb.id}
              to={`/cookbooks/${cb.id}`}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
            >
              <h2 className="font-semibold text-gray-800 dark:text-white text-lg mb-1"><FontAwesomeIcon icon={faBook} /> {cb.name}</h2>
              {cb.description && (
                <p className="text-sm text-gray-400 mb-3 truncate">{cb.description}</p>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span><FontAwesomeIcon icon={faUsers} /> {cb.members.length} membre{cb.members.length > 1 ? "s" : ""}</span>
                <span>
                  {cb.members.find((m) => m.role === "OWNER")?.user?.name
                    ? `Créateur : ${cb.members.find((m) => m.role === "OWNER").user.name}`
                    : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
