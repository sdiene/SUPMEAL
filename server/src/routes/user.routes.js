import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { updateMe, updatePassword, deleteMe } from "../controllers/user.controller.js";
const router = Router();
router.use(requireAuth);

/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Mettre à jour mon profil et mes préférences culinaires
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               diet: { type: string, description: "ex. végétarien, sans gluten" }
 *               allergies: { type: string }
 *               defaultPortions: { type: integer }
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.patch("/me", updateMe);

/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: Changer mon mot de passe
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Mot de passe modifié
 *       401:
 *         description: Mot de passe actuel incorrect
 */
router.patch("/me/password", updatePassword);
/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Supprimer mon compte définitivement
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       204:
 *         description: Compte supprimé
 */
router.delete("/me", deleteMe);

export default router;
