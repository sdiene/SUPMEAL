import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function RecipeCard({ recipe, onFavoriteToggle }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {recipe.imageUrl ? (
        <img
          src={API_URL + recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-4xl">
          🍽️
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/recipes/${recipe.id}`}
            className="font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1"
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

        <p className="text-xs text-gray-400 mt-1">
          {recipe.prepTime ? `⏱ ${recipe.prepTime} min` : ""}
          {recipe.cookTime ? ` · 🔥 ${recipe.cookTime} min` : ""}
          {recipe.servings ? ` · 👥 ${recipe.servings} pers.` : ""}
        </p>

        <div className="flex gap-1 mt-2 flex-wrap">
          {recipe.tags?.slice(0, 3).map((rt) => (
            <span
              key={rt.tagId || rt.tag?.name}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
            >
              {rt.tag?.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
