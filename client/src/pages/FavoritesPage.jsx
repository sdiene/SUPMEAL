import { useEffect, useState } from "react";
import { searchRecipes } from "../api/search";
import { toggleFavorite } from "../api/recipes";
import RecipeCard from "../components/RecipeCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

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
<FontAwesomeIcon icon={faStar} /> Mes favoris
      </h1>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">
          {recipes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase())).length} recette{recipes.length > 1 ? "s" : ""} en favori
        </p>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher dans mes favoris..."
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-72"
        />
      </div>

      {recipes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 p-12 text-center">
          <p className="text-4xl mb-3"><FontAwesomeIcon icon={faStar} /></p>
          <p className="text-gray-400">Aucune recette en favori pour l'instant</p>
          <p className="text-gray-300 text-sm mt-1">
            Cliquez sur l'étoile <FontAwesomeIcon icon={faStarRegular} /> sur une recette pour l'ajouter aux favoris
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {recipes.filter((r) => r.title.toLowerCase().includes(q.toLowerCase())).map((recipe) => (
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
