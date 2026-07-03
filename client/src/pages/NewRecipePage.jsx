import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createRecipe } from "../api/recipes";
import RecipeForm from "../components/RecipeForm";
export default function NewRecipePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cookbookId = searchParams.get("cookbookId");
  async function handleSubmit(formData) {
    setLoading(true);
    setError("");
    try {
      if (cookbookId) formData.append("cookbookId", cookbookId);
      const res = await createRecipe(formData);
      if (cookbookId) {
        navigate("/cookbooks/" + cookbookId);
      } else {
        navigate("/recipes/" + res.data.recipe.id);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {cookbookId ? "Nouvelle recette dans le cookbook" : "Nouvelle recette"}
      </h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}
      <RecipeForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
