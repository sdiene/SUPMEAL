import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { list, create, remove } from "../controllers/message.controller.js";
const router = Router({ mergeParams: true });
router.use(requireAuth);

/**
 * @swagger
 * /api/cookbooks/{cookbookId}/messages:
 *   get:
 *     summary: Lister les messages d'un cookbook
 *     tags: [Messages]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cookbookId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des messages
 *   post:
 *     summary: Envoyer un message dans un cookbook
 *     tags: [Messages]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cookbookId
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
 *         description: Message envoyé
 */
router.get("/", list);
router.post("/", create);

/**
 * @swagger
 * /api/cookbooks/{cookbookId}/messages/{messageId}:
 *   delete:
 *     summary: Supprimer un message (auteur ou OWNER uniquement)
 *     tags: [Messages]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: cookbookId
 *         required: true
 *         schema: { type: string }
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Message supprimé
 */
router.delete("/:messageId", remove);
export default router;
