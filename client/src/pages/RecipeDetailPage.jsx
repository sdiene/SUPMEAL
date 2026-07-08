import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRecipe, deleteRecipe, toggleFavorite, togglePublic } from "../api/recipes";
import { useAuth } from "../context/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export default function RecipeDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getRecipe(id)
      .then((res) => setRecipe(res.data.recipe))
      .catch(() => navigate("/recipes"))
      .finally(() => setLoading(false));
  }, [id]);
  async function handleDelete() {
    if (!confirm("Supprimer cette recette ?")) return;
    try {
      await deleteRecipe(id);
      navigate("/recipes");
    } catch (err) {
      console.error(err);
    }
  }
  async function handlePublicToggle() {
    try {
      const res = await togglePublic(id);
      setRecipe((prev) => ({ ...prev, isPublic: res.data.recipe.isPublic }));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleFavorite() {
    try {
      const res = await toggleFavorite(id);
      setRecipe((prev) => ({ ...prev, isFavorite: res.data.recipe.isFavorite }));
    } catch (err) {
      console.error(err);
    }
  }
  if (loading) return <p className="text-gray-400">Chargement...</p>;
  if (!recipe) return null;
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ← Retour
        </button>
      </div>

      {/* Image */}
      {recipe.imageUrl && (
        <img
          src={API_URL + recipe.imageUrl}
          alt={recipe.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}
      {/* Titre + actions */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{recipe.title}</h1>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleFavorite}
            className="text-2xl"
            title={recipe.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            {recipe.isFavorite ? "⭐" : "☆"}
          </button>
          {recipe.userId && recipe.userId === user?.id && (
            <button
              onClick={handlePublicToggle}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                recipe.isPublic
                  ? "bg-green-50 text-green-600 hover:bg-green-100"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
              }`}
            >
              {recipe.isPublic ? "🌍 Publique" : "🔒 Privée"}
            </button>
          )}
          {recipe.userId === user?.id && <Link
            to={`/recipes/${id}/edit`}
            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            ✏️ Modifier
          </Link>}
          {recipe.userId === user?.id && <button
            onClick={handleDelete}
            className="text-sm bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            🗑️ Supprimer
          </button>}
        </div>
      </div>
      {/* Méta */}
      <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
        {recipe.prepTime && <span>⏱ Prépa : {recipe.prepTime} min</span>}
        {recipe.cookTime && <span>🔥 Cuisson : {recipe.cookTime} min</span>}
        {recipe.servings && <span>👥 {recipe.servings} portions</span>}
      </div>
      {/* Tags */}
      {recipe.tags?.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {recipe.tags.map((rt) => (
            <span key={rt.tagId} className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
              {rt.tag.name}
            </span>
          ))}
        </div>
      )}
      {recipe.source && (
        <p className="text-sm text-gray-400 mb-6">
          Source : <span className="text-blue-500">{recipe.source}</span>
        </p>
      )}

      {/* Ingrédients */}
      {recipe.ingredients?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-4">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">🛒 Ingrédients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing) => (
              <li key={ing.id} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span>
                <span className="font-medium">{ing.name}</span>
                {ing.quantity && (
                  <span className="text-gray-400">
                    — {ing.quantity} {ing.unit || ""}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Étapes */}
      {recipe.steps?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">📋 Étapes</h2>
          <ol className="space-y-4">
            {[...recipe.steps]
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <li key={step.id} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.instruction}</p>
                </li>
              ))}
          </ol>
        </div>
      )}
    </div>
  );
}
