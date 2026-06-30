import {
  registerUser,
  loginUser,
  generateToken,
  sanitizeUser,
} from "../services/auth.service.js";
export async function register(req, res) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Champs manquants" });
    }
    const user = await registerUser({ email, password, name });
    const token = generateToken(user);
    res.status(201).json({ token, user: sanitizeUser(user) });
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
    if (err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function me(req, res) {
  res.json({ user: req.user });
}
