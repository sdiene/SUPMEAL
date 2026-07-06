import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchRecipes } from "../api/search";
import { getPublicRecipes, toggleFavorite } from "../api/recipes";
import { getCookbooks, getPublicCookbooks, copyRecipeToMyRecipes } from "../api/cookbooks";
import RecipeCard from "../components/RecipeCard";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("mes-recettes");
  const [cookbooks, setCookbooks] = useState([]);
  const [q, setQ] = useState("");
  const [cookbookId, setCookbookId] = useState("");
  const [tags, setTags] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [maxCookTime, setMaxCookTime] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [publicQ, setPublicQ] = useState("");
  const [publicResults, setPublicResults] = useState([]);
  const [publicLoading, setPublicLoading] = useState(false);
  const [publicSearched, setPublicSearched] = useState(false);
  const [cbQ, setCbQ] = useState("");
  const [publicCookbooks, setPublicCookbooks] = useState([]);
  const [cbLoading, setCbLoading] = useState(false);
  const [cbSearched, setCbSearched] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");
  useEffect(() => {
    getCookbooks().then((res) => setCookbooks(res.data.cookbooks));
  }, []);
  async function handleSearch(e) {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (cookbookId) params.cookbookId = cookbookId;
      if (tags) params.tags = tags;
      if (ingredient) params.ingredient = ingredient;
      if (maxPrepTime) params.maxPrepTime = maxPrepTime;
      if (maxCookTime) params.maxCookTime = maxCookTime;
      if (favoritesOnly) params.favoritesOnly = "true";
      const res = await searchRecipes(params);
      setResults(res.data.recipes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  async function handlePublicSearch(e) {
    e?.preventDefault();
    setPublicLoading(true);
    setPublicSearched(true);
    try {
      const params = {};
      if (publicQ) params.q = publicQ;
      const res = await getPublicRecipes(params);
      setPublicResults(res.data.recipes);
    } catch (err) {
      console.error(err);
    } finally {
      setPublicLoading(false);
    }
  }
  async function handleCbSearch(e) {
    e?.preventDefault();
    setCbLoading(true);
    setCbSearched(true);
    try {
      const params = {};
      if (cbQ) params.q = cbQ;
      const res = await getPublicCookbooks(params);
      setPublicCookbooks(res.data.cookbooks);
    } catch (err) {
      console.error(err);
    } finally {
      setCbLoading(false);
    }
  }
  async function handleFavoriteToggle(id) {
    try {
      const res = await toggleFavorite(id);
      setResults((prev) =>
        prev.map((r) => r.id === id ? { ...r, isFavorite: res.data.recipe.isFavorite } : r)
      );
    } catch (err) {
      console.error(err);
    }
  }
  async function handleCopyRecipe(recipeId) {
    try {
      await copyRecipeToMyRecipes(recipeId);
      setCopySuccess(recipeId);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error(err);
    }
  }
  const tabs = [
    { id: "mes-recettes", label: "🍽️ Mes recettes" },
    { id: "public", label: "🌍 Recettes publiques" },
    { id: "cookbooks-public", label: "📚 Cookbooks publics" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Rechercher</h1>
      <p className="text-gray-400 text-sm mb-6">
        Filtrez parmi vos recettes ou explorez la communauté
      </p>

      {/* Onglets */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== Mes recettes ===== */}
      {activeTab === "mes-recettes" && (
        <div>
          <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🔍 Recherche par titre</label>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Ex : poulet, tarte, soupe..."
                className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">📚 Cookbook</label>
                <select
                  value={cookbookId}
                  onChange={(e) => setCookbookId(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tous (perso + cookbooks)</option>
                  {cookbooks.map((cb) => (
                    <option key={cb.id} value={cb.id}>{cb.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🛒 Ingrédient</label>
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  placeholder="Ex : poulet, farine..."
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🏷️ Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ex : Dessert, Facile..."
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">⏱ Prépa max (min)</label>
                <input
                  type="number"
                  value={maxPrepTime}
                  onChange={(e) => setMaxPrepTime(e.target.value)}
                  placeholder="Ex : 30"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">🔥 Cuisson max (min)</label>
                <input
                  type="number"
                  value={maxCookTime}
                  onChange={(e) => setMaxCookTime(e.target.value)}
                  placeholder="Ex : 45"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="favoritesOnly"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
                <label htmlFor="favoritesOnly" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ⭐ Favoris uniquement
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Recherche..." : "🔍 Rechercher"}
              </button>
              <button
                type="button"
                onClick={() => { setQ(""); setCookbookId(""); setTags(""); setIngredient(""); setMaxPrepTime(""); setMaxCookTime(""); setFavoritesOnly(false); setResults([]); setSearched(false); }}
                className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Réinitialiser
              </button>
            </div>
          </form>

          {searched && (
            <div>
              <p className="text-sm text-gray-400 mb-4">
                {results.length} recette{results.length > 1 ? "s" : ""} trouvée{results.length > 1 ? "s" : ""}
              </p>
              {results.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
                  <p className="text-4xl mb-3">🔍</p>
                  <p className="text-gray-400">Aucune recette ne correspond à vos critères</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {results.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} onFavoriteToggle={handleFavoriteToggle} />
                  ))}
                </div>
              )}
            </div>
          )}

          {!searched && (
            <div className="text-center py-12 text-gray-300 dark:text-gray-600">
              <p className="text-5xl mb-3">🍽️</p>
              <p>Utilisez les filtres ci-dessus pour trouver vos recettes</p>
            </div>
          )}
        </div>
      )}

      {/* ===== Recettes publiques ===== */}
      {activeTab === "public" && (
        <div>
          <form onSubmit={handlePublicSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={publicQ}
              onChange={(e) => setPublicQ(e.target.value)}
              placeholder="Rechercher une recette publique..."
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={publicLoading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {publicLoading ? "..." : "🔍 Rechercher"}
            </button>
          </form>

          {publicSearched && publicResults.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <p className="text-gray-400">Aucune recette publique trouvée</p>
            </div>
          )}

          {publicResults.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-4">
                {publicResults.length} recette{publicResults.length > 1 ? "s" : ""} trouvée{publicResults.length > 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {publicResults.map((recipe) => (
                  <Link
                    key={recipe.id}
                    to={`/recipes/${recipe.id}`}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {recipe.imageUrl ? (
                      <img src={API_URL + recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl">🍽️</div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 dark:text-white">{recipe.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">Par {recipe.user?.name || "Anonyme"}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
                        {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
                      </p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {recipe.tags?.slice(0, 3).map((rt) => (
                          <span key={rt.tagId || rt.tag?.name} className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
                            {rt.tag?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!publicSearched && (
            <div className="text-center py-12 text-gray-300 dark:text-gray-600">
              <p className="text-5xl mb-3">🌍</p>
              <p>Recherchez parmi les recettes partagées par la communauté</p>
            </div>
          )}
        </div>
      )}

      {/* ===== Cookbooks publics ===== */}
      {activeTab === "cookbooks-public" && (
        <div>
          <form onSubmit={handleCbSearch} className="flex gap-3 mb-6">
            <input
              type="text"
              value={cbQ}
              onChange={(e) => setCbQ(e.target.value)}
              placeholder="Rechercher un cookbook public..."
              className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              disabled={cbLoading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {cbLoading ? "..." : "🔍 Rechercher"}
            </button>
          </form>

          {cbSearched && publicCookbooks.length === 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <p className="text-gray-400">Aucun cookbook public trouvé</p>
            </div>
          )}

          {publicCookbooks.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                {publicCookbooks.length} cookbook{publicCookbooks.length > 1 ? "s" : ""} trouvé{publicCookbooks.length > 1 ? "s" : ""}
              </p>
              {publicCookbooks.map((cb) => (
                <div key={cb.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white text-lg">📚 {cb.name}</h3>
                      {cb.description && <p className="text-sm text-gray-400 mt-1">{cb.description}</p>}
                      <p className="text-xs text-gray-400 mt-1">
                        Par {cb.members[0]?.user?.name || "Anonyme"} · {cb.recipes.length} recette{cb.recipes.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">🌍 Public</span>
                  </div>
                  {cb.recipes.length === 0 ? (
                    <p className="text-sm text-gray-400">Aucune recette dans ce cookbook</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {cb.recipes.map((recipe) => (
                        <div key={recipe.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{recipe.title}</p>
                            <p className="text-xs text-gray-400">
                              {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
                              {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopyRecipe(recipe.id)}
                            disabled={copySuccess === recipe.id}
                            className={`text-xs px-3 py-1.5 rounded-lg flex-shrink-0 transition-colors ${
                              copySuccess === recipe.id
                                ? "bg-green-100 text-green-600"
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            {copySuccess === recipe.id ? "✅ Copié" : "�� Copier"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!cbSearched && (
            <div className="text-center py-12 text-gray-300 dark:text-gray-600">
              <p className="text-5xl mb-3">📚</p>
              <p>Recherchez parmi les cookbooks partagés par la communauté</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
