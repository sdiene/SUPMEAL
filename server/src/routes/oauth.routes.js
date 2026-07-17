import { Router } from "express";
import passport from "../lib/passport.js";
import { googleCallback } from "../controllers/oauth.controller.js";
const router = Router();

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Démarrer la connexion OAuth2 avec Google
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers Google
 */
router.get("/google", (req, res, next) => {
  if (!passport._strategies.google) {
    return res.status(503).json({ error: "Google OAuth non configuré sur ce serveur" });
  }
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Callback OAuth2 Google (usage interne, redirige vers le frontend avec un token)
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirection vers le frontend avec le token JWT
 */
router.get(
  "/google/callback",
  (req, res, next) => {
    if (!passport._strategies.google) {
      return res.status(503).json({ error: "Google OAuth non configuré" });
    }
    passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" })(req, res, next);
  },
  googleCallback
);
router.get("/google/failure", (req, res) => {
  res.status(401).json({ error: "Échec de l'authentification Google" });
});
export default router;
