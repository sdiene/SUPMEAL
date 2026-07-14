import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { getFeed } from "../api/profiles";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function DashboardPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [cookbooks, setCookbooks] = useState([]);
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const [recipesRes, cookbooksRes, feedRes] = await Promise.all([
          apiClient.get("/api/recipes"),
          apiClient.get("/api/cookbooks"),
          getFeed(),
        ]);
        setRecipes(recipesRes.data.recipes);
        setCookbooks(cookbooksRes.data.cookbooks);
        setFeed(feedRes.data.recipes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
  if (loading) return <p className="text-gray-400">Chargement...</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        Bonjour, {user?.name} 👋
      </h1>
      <p className="text-gray-400 mb-8">Voici un aperçu de vos recettes et cookbooks.</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-400">Recettes perso</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{recipes.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-400">Cookbooks</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{cookbooks.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-400">Favoris</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {recipes.filter((r) => r.isFavorite).length}
          </p>
        </div>
      </div>
      {/* Recettes récentes — cliquables */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Recettes récentes</h2>
          <Link to="/recipes" className="text-sm text-green-600 hover:underline">Voir tout →</Link>
        </div>
        {recipes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
            <p className="text-gray-400 mb-3">Aucune recette pour l'instant</p>
            <Link to="/recipes/new" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
              + Créer une recette
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recipes.slice(0, 4).map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {recipe.imageUrl ? (
                  <img
                    src={API_URL + recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">🍽️</div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white">{recipe.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
                    {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
                  </p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {recipe.tags?.slice(0, 3).map((rt) => (
                      <span key={rt.tagId} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        {rt.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      {/* Fil d'actualité */}
      {feed.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              📡 Fil d'actualité
            </h2>
            <Link to="/search" className="text-sm text-red-600 hover:underline">Découvrir des cuisiniers →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {feed.slice(0, 4).map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {recipe.imageUrl ? (
                  <img src={API_URL + recipe.imageUrl} alt={recipe.title} className="w-full h-32 object-cover" />
                ) : (
                  <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-3xl">🍽️</div>
                )}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">{recipe.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Par <span className="text-red-600">{recipe.user?.name}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cookbooks — cliquables */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Mes cookbooks</h2>
          <Link to="/cookbooks" className="text-sm text-green-600 hover:underline">Voir tout →</Link>
        </div>
        {cookbooks.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-400">Aucun cookbook pour l'instant</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {cookbooks.slice(0, 4).map((cb) => (
              <Link
                key={cb.id}
                to={`/cookbooks/${cb.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-800 dark:text-white">📚 {cb.name}</h3>
                {cb.description && (
                  <p className="text-sm text-gray-400 mt-1 truncate">{cb.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {cb.members.length} membre{cb.members.length > 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
