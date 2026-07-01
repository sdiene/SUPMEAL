import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes, toggleFavorite } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getRecipes()
      .then((res) => setRecipes(res.data.recipes))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  async function handleFavoriteToggle(id) {
    try {
      const res = await toggleFavorite(id);
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, isFavorite: res.data.recipe.isFavorite } : r))
      );
    } catch (err) {
      console.error(err);
    }
  }
  if (loading) return <p className="text-gray-400">Chargement...</p>;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mes recettes</h1>
          <p className="text-gray-400 text-sm mt-1">{recipes.length} recette{recipes.length > 1 ? "s" : ""}</p>
        </div>
        <Link
          to="/recipes/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nouvelle recette
        </Link>
      </div>
      {recipes.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <p className="text-4xl mb-3">🍽️</p>
          <p className="text-gray-400 mb-4">Aucune recette pour l'instant</p>
          <Link
            to="/recipes/new"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Créer ma première recette
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
