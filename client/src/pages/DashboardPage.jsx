import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";
export default function DashboardPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [cookbooks, setCookbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const [recipesRes, cookbooksRes] = await Promise.all([
          apiClient.get("/api/recipes"),
          apiClient.get("/api/cookbooks"),
        ]);
        setRecipes(recipesRes.data.recipes);
        setCookbooks(cookbooksRes.data.cookbooks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Chargement...</p>;
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">
        Bonjour, {user?.name} 👋
      </h1>
      <p className="text-gray-400 mb-8">Voici un aperçu de vos recettes et cookbooks.</p>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-400">Recettes perso</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{recipes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-400">Cookbooks</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">{cookbooks.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-400">Favoris</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {recipes.filter((r) => r.isFavorite).length}
          </p>
        </div>
      </div>

      {/* Recettes récentes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Recettes récentes</h2>
          <Link to="/recipes" className="text-sm text-blue-600 hover:underline">
            Voir tout →
          </Link>
        </div>
        {recipes.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-400 mb-3">Aucune recette pour l'instant</p>
            <Link
              to="/recipes"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              + Créer une recette
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {recipes.slice(0, 4).map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                {recipe.imageUrl && (
                  <img
                    src={"http://localhost:3000" + recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-semibold text-gray-800">{recipe.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
                  {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {recipe.tags?.slice(0, 3).map((rt) => (
                    <span key={rt.tagId} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {rt.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cookbooks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Mes cookbooks</h2>
          <Link to="/cookbooks" className="text-sm text-blue-600 hover:underline">
            Voir tout →
          </Link>
        </div>
        {cookbooks.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-400">Aucun cookbook pour l'instant</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {cookbooks.slice(0, 4).map((cb) => (
              <div key={cb.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-800">📚 {cb.name}</h3>
                {cb.description && (
                  <p className="text-sm text-gray-400 mt-1 truncate">{cb.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {cb.members.length} membre{cb.members.length > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
