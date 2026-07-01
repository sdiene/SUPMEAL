import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/recipes";
import RecipeForm from "../components/RecipeForm";
export default function NewRecipePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(formData) {
    setLoading(true);
    setError("");
    try {
      const res = await createRecipe(formData);
      navigate(`/recipes/${res.data.recipe.id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nouvelle recette</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}
      <RecipeForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
