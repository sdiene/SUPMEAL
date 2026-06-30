import { searchRecipes } from "../services/search.service.js";
export async function search(req, res) {
  try {
    const recipes = await searchRecipes(req.user.id, req.query);
    res.json({ recipes, count: recipes.length });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
