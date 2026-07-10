import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { search, getProfile, toggleFollow, feed } from "../controllers/profile.controller.js";

const router = Router();

/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Rechercher des cuisiniers par nom
 *     tags: [Profiles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des profils
 */
router.get("/", requireAuth, search);

/**
 * @swagger
 * /api/profiles/feed:
 *   get:
 *     summary: Fil d'actualité des cuisiniers suivis
 *     tags: [Profiles]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Recettes récentes des cuisiniers suivis
 */
router.get("/feed", requireAuth, feed);

/**
 * @swagger
 * /api/profiles/{userId}:
 *   get:
 *     summary: Profil public d'un cuisinier
 *     tags: [Profiles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Profil public avec recettes et cookbooks
 */
router.get("/:userId", requireAuth, getProfile);

/**
 * @swagger
 * /api/profiles/{userId}/follow:
 *   post:
 *     summary: Suivre ou ne plus suivre un cuisinier
 *     tags: [Profiles]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Statut de suivi mis à jour
 */
router.post("/:userId/follow", requireAuth, toggleFollow);

export default router;
