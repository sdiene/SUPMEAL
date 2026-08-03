import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { search } from "../controllers/search.controller.js";
const router = Router();
router.use(requireAuth);

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Rechercher et filtrer des recettes (perso + cookbooks accessibles)
 *     tags: [Search]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Recherche plein texte sur le titre, les ingrédients et les étapes
 *       - in: query
 *         name: cookbookId
 *         schema: { type: string }
 *         description: Filtrer par cookbook spécifique
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *         description: Liste de tags séparés par virgules
 *       - in: query
 *         name: ingredient
 *         schema: { type: string }
 *         description: Filtrer par nom d'ingrédient (recherche partielle)
 *       - in: query
 *         name: maxPrepTime
 *         schema: { type: integer }
 *         description: Temps de préparation maximum (minutes)
 *       - in: query
 *         name: maxCookTime
 *         schema: { type: integer }
 *         description: Temps de cuisson maximum (minutes)
 *       - in: query
 *         name: favoritesOnly
 *         schema: { type: boolean }
 *         description: Ne montrer que les favoris
 *     responses:
 *       200:
 *         description: Liste des recettes filtrées
 */
router.get("/", search);
export default router;
