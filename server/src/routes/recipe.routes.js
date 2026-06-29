import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../lib/multer.js";
import {
  create,
  list,
  getOne,
  update,
  remove,
  favorite,
} from "../controllers/recipe.controller.js";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Lister mes recettes personnelles
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Liste des recettes
 *   post:
 *     summary: Créer une recette personnelle
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               prepTime:
 *                 type: integer
 *               cookTime:
 *                 type: integer
 *               servings:
 *                 type: integer
 *               source:
 *                 type: string
 *               ingredients:
 *                 type: string
 *                 description: JSON stringifié, ex. [{"name":"Farine","quantity":200,"unit":"g"}]
 *               steps:
 *                 type: string
 *                 description: JSON stringifié, ex. [{"order":1,"instruction":"Mélanger"}]
 *               tags:
 *                 type: string
 *                 description: JSON stringifié, ex. ["Dessert","Facile"]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Recette créée
 */
router.get("/", list);
router.post("/", upload.single("image"), create);

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Détail d'une recette
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail de la recette
 *       404:
 *         description: Recette introuvable
 *   put:
 *     summary: Modifier une recette
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recette modifiée
 *   delete:
 *     summary: Supprimer une recette
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Recette supprimée
 */
router.get("/:id", getOne);
router.put("/:id", upload.single("image"), update);
router.delete("/:id", remove);

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   patch:
 *     summary: Basculer le statut favori d'une recette
 *     tags: [Recipes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Statut favori mis à jour
 */
router.patch("/:id/favorite", favorite);

export default router;
