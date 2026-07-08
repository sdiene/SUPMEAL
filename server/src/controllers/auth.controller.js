import {
  registerUser,
  loginUser,
  verifyEmail,
  generateToken,
  sanitizeUser,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service.js";

export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Champs manquants" });
    }
    await registerUser({ email, password, name });
    res.status(201).json({
      message: "Compte créé ! Vérifiez votre email pour activer votre compte.",
    });
  } catch (err) {
    if (err.message === "EMAIL_TAKEN") {
      return res.status(409).json({ error: "Email déjà utilisé" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    const token = generateToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    const map = {
      INVALID_CREDENTIALS: [401, "Email ou mot de passe incorrect"],
      EMAIL_NOT_VERIFIED: [403, "Veuillez vérifier votre email avant de vous connecter"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}

export async function verifyEmailHandler(req, res) {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ error: "Token manquant" });

    await verifyEmail(token);
    res.json({ message: "Email vérifié avec succès" });
  } catch (err) {
    if (err.message === "INVALID_OR_EXPIRED_TOKEN") {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });

    await requestPasswordReset(email);
    res.json({ message: "Un email de réinitialisation a été envoyé si ce compte existe." });
  } catch (err) {
    if (err.message === "OAUTH_ONLY_ACCOUNT") {
      return res.status(400).json({ error: "Ce compte utilise une connexion Google, pas de mot de passe à réinitialiser." });
    }
    res.json({ message: "Un email de réinitialisation a été envoyé si ce compte existe." });
  }
}

export async function resetPasswordHandler(req, res) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token et nouveau mot de passe requis" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Le mot de passe doit faire au moins 8 caractères" });
    }

    await resetPassword(token, newPassword);
    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    if (err.message === "INVALID_OR_EXPIRED_TOKEN") {
      return res.status(400).json({ error: "Lien invalide ou expiré (1h)" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}
