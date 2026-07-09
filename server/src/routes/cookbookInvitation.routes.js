import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { invite } from "../controllers/invitation.controller.js";

const router = Router({ mergeParams: true });

router.use(requireAuth);

/**
 * @swagger
 * /api/cookbooks/{id}/invite:
 *   post:
 *     summary: Inviter un utilisateur dans un cookbook (crée une invitation à accepter)
 *     tags: [Invitations]
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
 *         description: Invitation envoyée
 */
router.post("/", invite);

export default router;
