import {
  createCookbook,
  getUserCookbooks,
  getCookbookById,
  addMember,
  removeMember,
  updateMemberRole,
  deleteCookbook,
  addRecipeToCookbook,
  toggleCookbookPublic,
  getPublicCookbooks,
  copyRecipeToUser,
} from "../services/cookbook.service.js";
export async function create(req, res) {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: "Le nom est requis" });

    const cookbook = await createCookbook(req.user.id, { name, description });
    res.status(201).json({ cookbook });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function list(req, res) {
  const cookbooks = await getUserCookbooks(req.user.id);
  res.json({ cookbooks });
}
export async function getOne(req, res) {
  try {
    const cookbook = await getCookbookById(req.user.id, req.params.id);
    res.json({ cookbook });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Cookbook introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}
export async function invite(req, res) {
  try {
    const { email, role } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis" });

    const member = await addMember(req.user.id, req.params.id, email, role);
    res.status(201).json({ member });
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Seul le créateur peut inviter des membres"],
      USER_NOT_FOUND: [404, "Utilisateur introuvable"],
      ALREADY_MEMBER: [409, "Cet utilisateur est déjà membre"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}
export async function removeMemberHandler(req, res) {
  try {
    await removeMember(req.user.id, req.params.id, req.params.userId);
    res.status(204).send();
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Seul le créateur peut retirer des membres"],
      CANNOT_REMOVE_SELF: [400, "Vous ne pouvez pas vous retirer vous-même"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}
export async function updateRole(req, res) {
  try {
    const { role } = req.body;
    const member = await updateMemberRole(req.user.id, req.params.id, req.params.userId, role);
    res.json({ member });
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Seul le créateur peut modifier les rôles"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}
export async function remove(req, res) {
  try {
    await deleteCookbook(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Seul le créateur peut supprimer ce cookbook"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}

export async function addRecipe(req, res) {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ error: "recipeId requis" });

    const recipe = await addRecipeToCookbook(req.user.id, req.params.id, recipeId);
    res.status(201).json({ recipe });
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Permissions insuffisantes (rôle EDITOR requis)"],
      NOT_FOUND: [404, "Recette introuvable"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}

export async function togglePublic(req, res) {
  try {
    const cookbook = await toggleCookbookPublic(req.user.id, req.params.id);
    res.json({ cookbook });
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Seul le créateur peut modifier la visibilité"],
      NOT_FOUND: [404, "Cookbook introuvable"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}

export async function listPublicCookbooks(req, res) {
  try {
    const cookbooks = await getPublicCookbooks(req.query);
    res.json({ cookbooks, count: cookbooks.length });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function copyRecipe(req, res) {
  try {
    const { recipeId } = req.body;
    if (!recipeId) return res.status(400).json({ error: "recipeId requis" });
    const recipe = await copyRecipeToUser(req.user.id, recipeId);
    res.status(201).json({ recipe });
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Cette recette n'est pas publique"],
      NOT_FOUND: [404, "Recette introuvable"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}
