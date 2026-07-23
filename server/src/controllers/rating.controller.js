import { rateRecipe, getRecipeRating, getUserRating } from "../services/rating.service.js";
export async function rate(req, res) {
  try {
    const { value } = req.body;
    if (!value) return res.status(400).json({ error: "Note requise (1-5)" });
    const result = await rateRecipe(req.user.id, req.params.recipeId, Number(value));
    res.json(result);
  } catch (err) {
    const map = {
      INVALID_RATING: [400, "La note doit être entre 1 et 5"],
      NOT_FOUND: [404, "Recette introuvable"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}
export async function getRating(req, res) {
  try {
    const [stats, userRating] = await Promise.all([
      getRecipeRating(req.params.recipeId),
      getUserRating(req.user.id, req.params.recipeId),
    ]);
    res.json({ ...stats, userRating });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
