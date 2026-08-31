import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes, toggleFavorite } from "../api/recipes";
import { useAllergyCheck } from "../hooks/useAllergyCheck";
import { searchRecipes } from "../api/search";
import { getCookbooks } from "../api/cookbooks";
import RecipeCard from "../components/RecipeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSliders,
  faMagnifyingGlass,
  faBook,
  faCartShopping,
  faTag,
  faStopwatch,
  faFire,
  faStar,
  faBowlFood,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
export default function RecipesPage() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [cookbooks, setCookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cookbookId, setCookbookId] = useState("");
  const [tags, setTags] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [maxPrepTime, setMaxPrepTime] = useState("");
  const [maxCookTime, setMaxCookTime] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [profileFilter, setProfileFilter] = useState(false);
  const { checkIngredients, isDietCompatible } = useAllergyCheck();
  useEffect(() => {
    Promise.all([getRecipes(), getCookbooks()])
      .then(([recipesRes, cbRes]) => {
        setAllRecipes(recipesRes.data.recipes);
        setDisplayed(recipesRes.data.recipes);
        setCookbooks(cbRes.data.cookbooks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSearch(e) {
    e?.preventDefault();
    const hasFilter = q || cookbookId || tags || ingredient || maxPrepTime || maxCookTime || favoritesOnly;
    if (!hasFilter) {
      setDisplayed(allRecipes);
      setIsFiltering(false);
      return;
    }
    setLoading(true);
    setIsFiltering(true);
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
      let filtered = res.data.recipes;
      if (profileFilter) {
        filtered = filtered.filter((r) =>
          checkIngredients(r.ingredients || []).length === 0 &&
          isDietCompatible(r.tags || [])
        );
      }
      setDisplayed(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setQ(""); setCookbookId(""); setTags(""); setIngredient("");
    setMaxPrepTime(""); setMaxCookTime(""); setFavoritesOnly(false);
    setDisplayed(allRecipes);
    setIsFiltering(false);
  }
  async function handleFavoriteToggle(id) {
    try {
      const res = await toggleFavorite(id);
      const updated = (prev) => prev.map((r) =>
        r.id === id ? { ...r, isFavorite: res.data.recipe.isFavorite } : r
      );
      setAllRecipes(updated);
      setDisplayed(updated);
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Mes recettes</h1>
          <p className="text-gray-400 text-sm mt-1">
            {isFiltering ? `${displayed.length} résultat(s)` : `${allRecipes.length} recette${allRecipes.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Link
          to="/recipes/new"
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} /> Nouvelle recette
        </Link>
      </div>
      {/* Barre de recherche */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3 mb-2">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher par titre, ingrédient ou étape..."
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              showFilters
                ? "border-red-500 text-red-600 bg-red-50 dark:bg-red-900/20"
                : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
<FontAwesomeIcon icon={faSliders} /> Filtres
          </button>
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        {/* Filtres avancés */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"><FontAwesomeIcon icon={faBook} /> Cookbook</label>
                <select
                  value={cookbookId}
                  onChange={(e) => setCookbookId(e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Tous</option>
                  {cookbooks.map((cb) => (
                    <option key={cb.id} value={cb.id}>{cb.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"><FontAwesomeIcon icon={faCartShopping} /> Ingrédient</label>
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  placeholder="Ex : poulet..."
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"><FontAwesomeIcon icon={faTag} /> Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Ex : Dessert, Facile..."
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"><FontAwesomeIcon icon={faStopwatch} /> Prépa max (min)</label>
                <input
                  type="number"
                  value={maxPrepTime}
                  onChange={(e) => setMaxPrepTime(e.target.value)}
                  placeholder="Ex : 30"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1"><FontAwesomeIcon icon={faFire} /> Cuisson max (min)</label>
                <input
                  type="number"
                  value={maxCookTime}
                  onChange={(e) => setMaxCookTime(e.target.value)}
                  placeholder="Ex : 45"
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="favOnly"
                  checked={favoritesOnly}
                  onChange={(e) => setFavoritesOnly(e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
                <label htmlFor="favOnly" className="text-sm text-gray-700 dark:text-gray-300"><FontAwesomeIcon icon={faStar} /> Favoris</label>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="profileFilter"
                  checked={profileFilter}
                  onChange={(e) => setProfileFilter(e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
                <label htmlFor="profileFilter" className="text-sm text-gray-700 dark:text-gray-300"><FontAwesomeIcon icon={faBowlFood} /> Compatible mon profil</label>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                Appliquer
              </button>
              <button type="button" onClick={handleReset} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 px-3 py-2">
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Résultats */}
      {loading ? (
        <p className="text-gray-400">Chargement...</p>
      ) : displayed.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <p className="text-4xl mb-3"><FontAwesomeIcon icon={faUtensils} /></p>
          <p className="text-gray-400 mb-4">
            {isFiltering ? "Aucune recette ne correspond à vos critères" : "Aucune recette pour l'instant"}
          </p>
          {!isFiltering && (
            <Link to="/recipes/new" className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
              Créer ma première recette
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {displayed.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onFavoriteToggle={handleFavoriteToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
