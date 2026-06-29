import {
  createRecipe,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  toggleFavorite,
} from "../services/recipe.service.js";
function parseJsonField(field) {
  if (!field) return undefined;
  if (typeof field === "object") return field;
  try {
    return JSON.parse(field);
  } catch {
    return undefined;
  }
}
export async function create(req, res) {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const body = {
      ...req.body,
      ingredients: parseJsonField(req.body.ingredients),
      steps: parseJsonField(req.body.steps),
      tags: parseJsonField(req.body.tags),
    };
    if (!body.title) {
      return res.status(400).json({ error: "Le titre est requis" });
    }
    const recipe = await createRecipe(req.user.id, body, imageUrl);
    res.status(201).json({ recipe });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function list(req, res) {
  const recipes = await getUserRecipes(req.user.id);
  res.json({ recipes });
}
export async function getOne(req, res) {
  try {
    const recipe = await getRecipeById(req.user.id, req.params.id);
    res.json({ recipe });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Recette introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function update(req, res) {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const body = {
      ...req.body,
      ingredients: parseJsonField(req.body.ingredients),
      steps: parseJsonField(req.body.steps),
      isFavorite: req.body.isFavorite !== undefined ? req.body.isFavorite === "true" || req.body.isFavorite === true : undefined,
    };
    const recipe = await updateRecipe(req.user.id, req.params.id, body, imageUrl);
    res.json({ recipe });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Recette introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function remove(req, res) {
  try {
    await deleteRecipe(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Recette introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function favorite(req, res) {
  try {
    const recipe = await toggleFavorite(req.user.id, req.params.id);
    res.json({ recipe });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Recette introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}
