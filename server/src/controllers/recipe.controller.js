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
    if (typeof field === "string" && field.includes(",")) {
      return field.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (typeof field === "string" && field.trim().length > 0) {
      return [field.trim()];
    }
    return undefined;
  }
}
function mapError(err) {
  const map = {
    NOT_FOUND: [404, "Recette introuvable"],
    FORBIDDEN: [403, "Permissions insuffisantes (rôle EDITOR requis)"],
  };
  return map[err.message] || [500, "Erreur serveur"];
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
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
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
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
export async function update(req, res) {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const body = {
      ...req.body,
      ingredients: parseJsonField(req.body.ingredients),
      steps: parseJsonField(req.body.steps),
      isFavorite:
        req.body.isFavorite !== undefined
          ? req.body.isFavorite === "true" || req.body.isFavorite === true
          : undefined,
    };
    const recipe = await updateRecipe(req.user.id, req.params.id, body, imageUrl);
    res.json({ recipe });
  } catch (err) {
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
export async function remove(req, res) {
  try {
    await deleteRecipe(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
export async function favorite(req, res) {
  try {
    const recipe = await toggleFavorite(req.user.id, req.params.id);
    res.json({ recipe });
  } catch (err) {
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
