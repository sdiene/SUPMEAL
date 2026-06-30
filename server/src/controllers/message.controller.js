import { getMessages, postMessage, deleteMessage } from "../services/message.service.js";
function mapError(err) {
  const map = {
    FORBIDDEN: [403, "Vous n'êtes pas membre de ce cookbook"],
    EMPTY_CONTENT: [400, "Le message ne peut pas être vide"],
    NOT_FOUND: [404, "Message introuvable"],
  };
  return map[err.message] || [500, "Erreur serveur"];
}
export async function list(req, res) {
  try {
    const messages = await getMessages(req.user.id, req.params.cookbookId);
    res.json({ messages });
  } catch (err) {
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
export async function create(req, res) {
  try {
    const message = await postMessage(req.user.id, req.params.cookbookId, req.body.content);
    res.status(201).json({ message });
  } catch (err) {
    const [status, errMessage] = mapError(err);
    res.status(status).json({ error: errMessage });
  }
}
export async function remove(req, res) {
  try {
    await deleteMessage(req.user.id, req.params.messageId);
    res.status(204).send();
  } catch (err) {
    const [status, message] = mapError(err);
    res.status(status).json({ error: message });
  }
}
