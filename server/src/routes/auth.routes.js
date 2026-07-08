import { Router } from "express";
import { register, login, me, verifyEmailHandler, forgotPassword, resetPasswordHandler } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       409:
 *         description: Email déjà utilisé
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Se connecter
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 */
router.post("/login", login);
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non authentifié
 */
router.get("/me", requireAuth, me);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Vérifier l'email via token (lien reçu par email)
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       302:
 *         description: Redirection vers le frontend après vérification
 */
router.get("/verify-email", verifyEmailHandler);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Demander une réinitialisation de mot de passe
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Email envoyé si le compte existe
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string }
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé
 */
router.post("/reset-password", resetPasswordHandler);
export default router;
