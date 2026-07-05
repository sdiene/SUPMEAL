import { useEffect, useState } from "react";
import { searchRecipes } from "../api/search";
import { toggleFavorite } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchRecipes({ favoritesOnly: "true" })
      .then((res) => setRecipes(res.data.recipes))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleFavoriteToggle(id) {
    try {
      const res = await toggleFavorite(id);
      if (!res.data.recipe.isFavorite) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p className="text-gray-400">Chargement...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
        ⭐ Mes favoris
      </h1>
      <p className="text-gray-400 text-sm mb-6">
        {recipes.length} recette{recipes.length > 1 ? "s" : ""} en favori
      </p>

      {recipes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <p className="text-4xl mb-3">⭐</p>
          <p className="text-gray-400">Aucune recette en favori pour l'instant</p>
          <p className="text-gray-300 text-sm mt-1">
            Cliquez sur l'étoile ☆ sur une recette pour l'ajouter aux favoris
          </p>
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
