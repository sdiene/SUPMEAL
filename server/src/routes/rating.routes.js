import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { rate, getRating } from "../controllers/rating.controller.js";
const router = Router({ mergeParams: true });
router.use(requireAuth);
/**
 * @swagger
 * /api/recipes/{recipeId}/rating:
 *   get:
 *     summary: Obtenir la note moyenne d'une recette
 *     tags: [Ratings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Note moyenne et note de l'utilisateur
 *   post:
 *     summary: Noter une recette (1-5 étoiles)
 *     tags: [Ratings]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [value]
 *             properties:
 *               value:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Note enregistrée
 */
router.get("/", getRating);
router.post("/", rate);
export default router;
