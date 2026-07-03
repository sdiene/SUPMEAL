import {
  registerUser,
  loginUser,
  verifyEmail,
  generateToken,
  sanitizeUser,
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
