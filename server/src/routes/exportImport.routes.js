import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { exportData, importData } from "../controllers/exportImport.controller.js";
const router = Router();
router.use(requireAuth);

/**
 * @swagger
 * /api/export:
 *   get:
 *     summary: Exporter mes recettes (perso + cookbooks accessibles)
 *     tags: [Export/Import]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [json, csv] }
 *         description: Format d'export (json par défaut)
 *       - in: query
 *         name: recipeIds
 *         schema: { type: string }
 *         description: Liste d'IDs de recettes séparés par virgules. Si omis, exporte toutes les recettes accessibles.
 *     responses:
 *       200:
 *         description: Fichier d'export téléchargé
 */
router.get("/export", exportData);

/**
 * @swagger
 * /api/import:
 *   post:
 *     summary: Importer des recettes (attribution automatique à l'utilisateur courant)
 *     tags: [Export/Import]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: format
 *         schema: { type: string, enum: [json, csv] }
 *         description: Format d'import (json par défaut)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipes:
 *                 type: array
 *                 description: Tableau de recettes au format JSON (si format=json)
 *               csv:
 *                 type: string
 *                 description: Contenu CSV brut (si format=csv)
 *     responses:
 *       201:
 *         description: Recettes importées
 */
router.post("/import", importData);
export default router;
