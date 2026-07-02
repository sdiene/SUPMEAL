import { updateProfile, changePassword, deleteAccount } from "../services/user.service.js";
import { sanitizeUser } from "../services/auth.service.js";
export async function updateMe(req, res) {
  try {
    const { name, diet, allergies, defaultPortions } = req.body;
    const user = await updateProfile(req.user.id, { name, diet, allergies, defaultPortions });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Mot de passe actuel et nouveau requis" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: "Le nouveau mot de passe doit faire au moins 8 caractères" });
    }
    await changePassword(req.user.id, currentPassword, newPassword);
    res.json({ message: "Mot de passe modifié avec succès" });
  } catch (err) {
    const map = {
      INVALID_CURRENT_PASSWORD: [401, "Mot de passe actuel incorrect"],
      OAUTH_ONLY_ACCOUNT: [400, "Ce compte n'a pas de mot de passe (connexion OAuth uniquement)"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}

export async function deleteMe(req, res) {
  try {
    await deleteAccount(req.user.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression du compte" });
  }
}
