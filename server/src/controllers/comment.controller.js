import { getComments, postComment, deleteComment } from "../services/comment.service.js";
function mapError(err) {
  const map = {
    FORBIDDEN: [403, "Permissions insuffisantes (rôle COMMENTER requis minimum)"],
    EMPTY_CONTENT: [400, "Le commentaire ne peut pas être vide"],
    NOT_FOUND: [404, "Ressource introuvable"],
  };
  return map[err.message] || [500, "Erreur serveur"];
}
export async function list(req, res) {
  try {
    const comments = await getComments(req.user.id, req.params.recipeId);
    res.json({ comments });
  } catch (err) {
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
export async function create(req, res) {
  try {
    const comment = await postComment(req.user.id, req.params.recipeId, req.body.content);
    res.status(201).json({ comment });
  } catch (err) {
    const [status, errMessage] = mapError(err);
    res.status(status).json({ error: errMessage });
  }
}
export async function remove(req, res) {
  try {
    await deleteComment(req.user.id, req.params.commentId);
    res.status(204).send();
  } catch (err) {
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
