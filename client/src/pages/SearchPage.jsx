import { useState, useEffect } from "react";
import { searchRecipes } from "../api/search";
import { getCookbooks } from "../api/cookbooks";
import RecipeCard from "../components/RecipeCard";
import { toggleFavorite } from "../api/recipes";
export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [cookbooks, setCookbooks] = useState([]);
  const [q, setQ] = useState("");
  const [cookbookId, setCookbookId] = useState("");
  const [tags, setTags] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [maxCookTime, setMaxCookTime] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
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
  async function handleFavoriteToggle(id) {
    try {
      const res = await toggleFavorite(id);
      setResults((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, isFavorite: res.data.recipe.isFavorite } : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  function handleReset() {
    setQ("");
    setCookbookId("");
    setTags("");
    setIngredient("");
    setMaxPrepTime("");
    setMaxCookTime("");
    setFavoritesOnly(false);
    setResults([]);
    setSearched(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        Rechercher
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        Filtrez parmi toutes vos recettes et cookbooks
      </p>

      {/* Formulaire de recherche */}
      <form
        onSubmit={handleSearch}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
      >
        {/* Recherche plein texte */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            🔍 Recherche par titre
          </label>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Ex : poulet, tarte, soupe..."
            className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Filtrage par cookbook */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              📚 Cookbook
            </label>
            <select
              value={cookbookId}
              onChange={(e) => setCookbookId(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Tous (perso + cookbooks)</option>
              {cookbooks.map((cb) => (
                <option key={cb.id} value={cb.id}>
                  {cb.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filtrage par ingrédient */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🛒 Ingrédient
            </label>
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Ex : poulet, farine..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Filtrage par tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🏷️ Tags (séparés par virgules)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex : Dessert, Facile..."
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Temps de préparation max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ⏱ Temps de prépa max (min)
            </label>
            <input
              type="number"
              value={maxPrepTime}
              onChange={(e) => setMaxPrepTime(e.target.value)}
              placeholder="Ex : 30"
              min={1}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Temps de cuisson max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              🔥 Temps de cuisson max (min)
            </label>
            <input
              type="number"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(e.target.value)}
              placeholder="Ex : 45"
              min={1}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Favoris uniquement */}
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="favoritesOnly"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
              className="w-4 h-4 accent-red-600"
            />
            <label
              htmlFor="favoritesOnly"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ⭐ Favoris uniquement
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Recherche..." : "🔍 Rechercher"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      </form>

      {/* Résultats */}
      {searched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Résultats
            </h2>
            <p className="text-sm text-gray-400">
              {results.length} recette{results.length > 1 ? "s" : ""} trouvée
              {results.length > 1 ? "s" : ""}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-400">Aucune recette ne correspond à vos critères</p>
              <p className="text-gray-300 text-sm mt-1">Essayez d'élargir vos filtres</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {results.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onFavoriteToggle={handleFavoriteToggle}
                />
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
  );
}
