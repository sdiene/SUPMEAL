import {
  exportAsJSON,
  exportAsCSV,
  importFromJSON,
  importFromCSV,
} from "../services/exportImport.service.js";
function parseRecipeIds(query) {
  if (!query.recipeIds) return undefined;
  return query.recipeIds.split(",").map((id) => id.trim()).filter(Boolean);
}
export async function exportData(req, res) {
  try {
    const format = req.query.format || "json";
    const recipeIds = parseRecipeIds(req.query);
    if (format === "csv") {
      const csv = await exportAsCSV(req.user.id, recipeIds);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=supmeal-recipes.csv");
      return res.send(csv);
    }
    const json = await exportAsJSON(req.user.id, recipeIds);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=supmeal-recipes.json");
    res.json(json);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'export" });
  }
}
export async function importData(req, res) {
  try {
    const format = req.query.format || "json";
    let created;
    if (format === "csv") {
      if (!req.body.csv) {
        return res.status(400).json({ error: "Champ 'csv' (texte) requis" });
      }
      created = await importFromCSV(req.user.id, req.body.csv);
    } else {
      if (!req.body.recipes) {
        return res.status(400).json({ error: "Champ 'recipes' (JSON) requis" });
      }
      created = await importFromJSON(req.user.id, req.body.recipes);
    }
    res.status(201).json({ imported: created.length, recipes: created });
  } catch (err) {
    if (err.message === "INVALID_RECIPE_DATA") {
      return res.status(400).json({ error: "Données de recette invalides (titre manquant)" });
    }
    res.status(500).json({ error: "Erreur lors de l'import" });
  }
}
