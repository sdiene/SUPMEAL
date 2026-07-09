import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { invite, myInvitations, respond, pendingCount } from "../controllers/invitation.controller.js";

const router = Router();

router.use(requireAuth);

/**
 * @swagger
 * /api/invitations:
 *   get:
 *     summary: Lister mes invitations en attente
 *     tags: [Invitations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Liste des invitations
 */
router.get("/", myInvitations);

/**
 * @swagger
 * /api/invitations/count:
 *   get:
 *     summary: Nombre d'invitations en attente
 *     tags: [Invitations]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Nombre d'invitations
 */
router.get("/count", pendingCount);

/**
 * @swagger
 * /api/invitations/{invitationId}/respond:
 *   post:
 *     summary: Accepter ou refuser une invitation
 *     tags: [Invitations]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: invitationId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accept]
 *             properties:
 *               accept: { type: boolean }
 *     responses:
 *       200:
 *         description: Réponse enregistrée
 */
router.post("/:invitationId/respond", respond);

export default router;
