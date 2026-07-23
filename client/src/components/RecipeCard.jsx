import { Link } from "react-router-dom";
import { useAllergyCheck } from "../hooks/useAllergyCheck";
import StarRating from "./StarRating";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function RecipeCard({ recipe, onFavoriteToggle }) {
  const { checkIngredients } = useAllergyCheck();
  const conflicts = checkIngredients(recipe.ingredients || []);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      {recipe.imageUrl ? (
        <img
          src={API_URL + recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-4xl">
          🍽️
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/recipes/${recipe.id}`}
            className="font-semibold text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors line-clamp-1"
          >
            {recipe.title}
          </Link>
          <button
            onClick={() => onFavoriteToggle?.(recipe.id)}
            className="text-lg flex-shrink-0"
            title={recipe.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {recipe.isFavorite ? "⭐" : "☆"}
          </button>
        </div>

        {conflicts.length > 0 && (
          <span className="inline-flex items-center gap-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full mt-1 mb-1">
            ⚠️ Allergène
          </span>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">
          {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
          {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
          {recipe.servings ? ` · 👥 ${recipe.servings} pers.` : ""}
        </p>

        <div className="flex gap-1 mt-2 flex-wrap">
          {recipe.tags?.slice(0, 3).map((rt) => (
            <span
              key={rt.tagId || rt.tag?.name}
              className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full"
            >
              {rt.tag?.name}
            </span>
          ))}
        </div>
        {recipe.averageRating && (
          <div className="flex items-center gap-1 mt-2">
            <StarRating value={Math.round(recipe.averageRating)} readonly size="sm" />
            <span className="text-xs text-gray-400">{recipe.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
