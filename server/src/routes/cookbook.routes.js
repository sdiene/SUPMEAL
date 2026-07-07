import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import messageRoutes from "./message.routes.js";
import {
  create,
  list,
  getOne,
  invite,
  removeMemberHandler,
  updateRole,
  remove,
  addRecipe,
  togglePublic,
  listPublicCookbooks,
  copyRecipe,
} from "../controllers/cookbook.controller.js";
const router = Router();
router.use(requireAuth);

/**
 * @swagger
 * /api/cookbooks:
 *   get:
 *     summary: Lister mes cookbooks
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Liste des cookbooks
 *   post:
 *     summary: Créer un cookbook
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Cookbook créé
 */
router.get("/", list);
router.post("/", create);

/**
 * @swagger
 * /api/cookbooks/{id}:
 *   get:
 *     summary: Détail d'un cookbook (avec membres et recettes)
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Détail du cookbook
 *   delete:
 *     summary: Supprimer un cookbook (créateur uniquement)
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Cookbook supprimé
 */
router.get("/public", listPublicCookbooks);
router.get("/:id", getOne);
router.delete("/:id", remove);

/**
 * @swagger
 * /api/cookbooks/{id}/members:
 *   post:
 *     summary: Inviter un membre par email (créateur uniquement)
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *               role:
 *                 type: string
 *                 enum: [OWNER, EDITOR, READER, COMMENTER]
 *     responses:
 *       201:
 *         description: Membre ajouté
 */
router.post("/:id/members", invite);

/**
 * @swagger
 * /api/cookbooks/{id}/members/{userId}:
 *   patch:
 *     summary: Modifier le rôle d'un membre (créateur uniquement)
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [OWNER, EDITOR, READER, COMMENTER]
 *     responses:
 *       200:
 *         description: Rôle modifié
 *   delete:
 *     summary: Retirer un membre (créateur uniquement)
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Membre retiré
 */
router.patch("/:id/members/:userId", updateRole);
router.delete("/:id/members/:userId", removeMemberHandler);
/**
 * @swagger
 * /api/cookbooks/{id}/recipes:
 *   post:
 *     summary: Ajouter une recette existante dans un cookbook (copie)
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipeId]
 *             properties:
 *               recipeId: { type: string }
 *     responses:
 *       201:
 *         description: Recette ajoutée au cookbook
 */
router.post("/:id/recipes", addRecipe);

/**
 * @swagger
 * /api/cookbooks/public:
 *   get:
 *     summary: Lister les cookbooks publics
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des cookbooks publics
 */

/**
 * @swagger
 * /api/cookbooks/{id}/public:
 *   patch:
 *     summary: Basculer la visibilité publique d'un cookbook (OWNER uniquement)
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Visibilité mise à jour
 */
router.patch("/:id/public", togglePublic);

/**
 * @swagger
 * /api/cookbooks/copy-recipe:
 *   post:
 *     summary: Copier une recette publique dans ses recettes perso
 *     tags: [Cookbooks]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipeId]
 *             properties:
 *               recipeId: { type: string }
 *     responses:
 *       201:
 *         description: Recette copiée
 */
router.post("/copy-recipe", copyRecipe);
router.use("/:cookbookId/messages", messageRoutes);
export default router;
