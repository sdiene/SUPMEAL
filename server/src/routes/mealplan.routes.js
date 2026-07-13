import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getWeek, add, remove, shoppingList } from "../controllers/mealplan.controller.js";
const router = Router();
router.use(requireAuth);
/**
 * @swagger
 * /api/mealplan:
 *   get:
 *     summary: Récupérer le planning d'une semaine
 *     tags: [MealPlan]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: weekStart
 *         required: true
 *         schema: { type: string }
 *         description: Date de début de semaine (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Planning de la semaine
 *   post:
 *     summary: Ajouter une recette au planning
 *     tags: [MealPlan]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipeId, date]
 *             properties:
 *               recipeId: { type: string }
 *               date: { type: string }
 *               mealType:
 *                 type: string
 *                 enum: [BREAKFAST, LUNCH, DINNER, SNACK]
 *     responses:
 *       201:
 *         description: Recette ajoutée au planning
 */
router.get("/", getWeek);
router.post("/", add);
/**
 * @swagger
 * /api/mealplan/{id}:
 *   delete:
 *     summary: Retirer une recette du planning
 *     tags: [MealPlan]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Recette retirée
 */
router.delete("/:id", remove);
/**
 * @swagger
 * /api/mealplan/shopping-list:
 *   get:
 *     summary: Générer la liste de courses de la semaine
 *     tags: [MealPlan]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: weekStart
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste de courses agrégée
 */
router.get("/shopping-list", shoppingList);
export default router;
