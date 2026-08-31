import { getMemberRole } from "../services/cookbook.service.js";
const ROLE_LEVELS = { READER: 1, COMMENTER: 2, EDITOR: 3, OWNER: 4 };
export function requireCookbookRole(minRole) {
  return async (req, res, next) => {
    const cookbookId = req.params.id || req.params.cookbookId;
    const role = await getMemberRole(req.user.id, cookbookId);
    if (!role) {
      return res.status(403).json({ error: "Vous n'êtes pas membre de ce cookbook" });
    }
    if (ROLE_LEVELS[role] < ROLE_LEVELS[minRole]) {
      return res.status(403).json({ error: "Permissions insuffisantes" });§
    }
    req.cookbookRole = role;
    next();
  };
}
