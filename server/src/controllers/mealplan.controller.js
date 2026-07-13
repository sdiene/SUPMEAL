import {
  getWeekPlan,
  addToMealPlan,
  removeFromMealPlan,
  generateShoppingList,
} from "../services/mealplan.service.js";
export async function getWeek(req, res) {
  try {
    const { weekStart } = req.query;
    if (!weekStart) return res.status(400).json({ error: "weekStart requis (YYYY-MM-DD)" });
    const plans = await getWeekPlan(req.user.id, weekStart);
    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function add(req, res) {
  try {
    const { recipeId, date, mealType } = req.body;
    if (!recipeId || !date) return res.status(400).json({ error: "recipeId et date requis" });

    const plan = await addToMealPlan(req.user.id, recipeId, date, mealType);
    res.status(201).json({ plan });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Recette introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function remove(req, res) {
  try {
    await removeFromMealPlan(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Entrée introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function shoppingList(req, res) {
  try {
    const { weekStart } = req.query;
    if (!weekStart) return res.status(400).json({ error: "weekStart requis" });
    const ingredients = await generateShoppingList(req.user.id, weekStart);
    res.json({ ingredients, count: ingredients.length });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
