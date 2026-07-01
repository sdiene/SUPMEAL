import { useState } from "react";
export default function RecipeForm({ initial = {}, onSubmit, loading }) {
  const [title, setTitle] = useState(initial.title || "");
  const [prepTime, setPrepTime] = useState(initial.prepTime || "");
  const [cookTime, setCookTime] = useState(initial.cookTime || "");
  const [servings, setServings] = useState(initial.servings || "");
  const [source, setSource] = useState(initial.source || "");
  const [tags, setTags] = useState(initial.tags?.map((t) => t.tag.name).join(", ") || "");
  const [ingredients, setIngredients] = useState(
    initial.ingredients?.length
      ? initial.ingredients
      : [{ name: "", quantity: "", unit: "" }]
  );
  const [steps, setSteps] = useState(
    initial.steps?.length
      ? initial.steps
      : [{ instruction: "" }]
  );
  const [image, setImage] = useState(null);

  function addIngredient() {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  }
  function updateIngredient(index, field, value) {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  }
  function removeIngredient(index) {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }
  function addStep() {
    setSteps([...steps, { instruction: "" }]);
  }
  function updateStep(index, value) {
    const updated = [...steps];
    updated[index].instruction = value;
    setSteps(updated);
  }
  function removeStep(index) {
    setSteps(steps.filter((_, i) => i !== index));
  }
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (prepTime) formData.append("prepTime", prepTime);
    if (cookTime) formData.append("cookTime", cookTime);
    if (servings) formData.append("servings", servings);
    if (source) formData.append("source", source);
    if (tags) formData.append("tags", tags);
    formData.append("ingredients", JSON.stringify(ingredients.filter((i) => i.name)));
    formData.append("steps", JSON.stringify(steps.filter((s) => s.instruction).map((s, i) => ({ ...s, order: i + 1 }))));
    if (image) formData.append("image", image);
    onSubmit(formData);
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Infos de base */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Informations générales</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temps de prépa (min)</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temps de cuisson (min)</label>
            <input
              type="number"
              value={cookTime}
              onChange={(e) => setCookTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portions</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source (URL ou description)</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par virgules)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Dessert, Français, Facile"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:font-medium hover:file:bg-blue-100"
          />
        </div>
      </div>
      {/* Ingrédients */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Ingrédients</h2>
        <div className="space-y-3">
          {ingredients.map((ing, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Nom"
                value={ing.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantité"
                value={ing.quantity}
                onChange={(e) => updateIngredient(index, "quantity", e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Unité"
                value={ing.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="text-red-400 hover:text-red-600 text-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addIngredient}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          + Ajouter un ingrédient
        </button>
      </div>

      {/* Étapes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Étapes de préparation</h2>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-sm font-bold flex items-center justify-center flex-shrink-0 mt-1.5">
                {index + 1}
              </span>
              <textarea
                placeholder="Description de l'étape..."
                value={step.instruction}
                onChange={(e) => updateStep(index, e.target.value)}
                rows={2}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="text-red-400 hover:text-red-600 text-lg mt-1.5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="mt-3 text-sm text-blue-600 hover:underline"
        >
          + Ajouter une étape
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Enregistrer la recette"}
      </button>
    </form>
  );
}
