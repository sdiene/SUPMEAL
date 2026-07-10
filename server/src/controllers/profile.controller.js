import {
  searchProfiles,
  getPublicProfile,
  followUser,
  getFollowingFeed,
} from "../services/profile.service.js";

export async function search(req, res) {
  try {
    const { q } = req.query;
    const profiles = await searchProfiles(q);
    res.json({ profiles });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function getProfile(req, res) {
  try {
    const profile = await getPublicProfile(req.params.userId, req.user?.id);
    res.json(profile);
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Profil introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function toggleFollow(req, res) {
  try {
    const result = await followUser(req.user.id, req.params.userId);
    res.json(result);
  } catch (err) {
    const map = {
      CANNOT_FOLLOW_SELF: [400, "Vous ne pouvez pas vous suivre vous-même"],
      NOT_FOUND: [404, "Utilisateur introuvable"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}

export async function feed(req, res) {
  try {
    const recipes = await getFollowingFeed(req.user.id);
    res.json({ recipes });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
