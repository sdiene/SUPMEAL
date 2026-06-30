import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { list, create, remove } from "../controllers/comment.controller.js";
const router = Router({ mergeParams: true });
router.use(requireAuth);

/**
 * @swagger
 * /api/recipes/{recipeId}/comments:
 *   get:
 *     summary: Lister les commentaires d'une recette
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des commentaires
 *   post:
 *     summary: Commenter une recette (COMMENTER minimum si recette de cookbook)
 *     tags: [Comments]
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
 *             required: [content]
 *             properties:
 *               content: { type: string }
 *     responses:
 *       201:
 *         description: Commentaire ajouté
 */
router.get("/", list);
router.post("/", create);
/**
 * @swagger
 * /api/recipes/{recipeId}/comments/{commentId}:
 *   delete:
 *     summary: Supprimer un commentaire (auteur ou OWNER du cookbook)
 *     tags: [Comments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Commentaire supprimé
 */
router.delete("/:commentId", remove);
export default router;
