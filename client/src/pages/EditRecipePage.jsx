import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipe, updateRecipe } from "../api/recipes";
import RecipeForm from "../components/RecipeForm";
export default function EditRecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    getRecipe(id)
      .then((res) => setRecipe(res.data.recipe))
      .catch(() => navigate("/recipes"))
      .finally(() => setLoading(false));
  }, [id]);
  async function handleSubmit(formData) {
    setSaving(true);
    setError("");
    try {
      await updateRecipe(id, formData);
      navigate(`/recipes/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de la modification");
    } finally {
      setSaving(false);
    }
  }
  if (loading) return <p className="text-gray-400">Chargement...</p>;
  if (!recipe) return null;
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Modifier la recette</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}
      <RecipeForm initial={recipe} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}
