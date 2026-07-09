import {
  sendInvitation,
  getMyInvitations,
  respondToInvitation,
  getPendingCount,
} from "../services/invitation.service.js";

export async function invite(req, res) {
  try {
    const { email, role } = req.body;
    const { id: cookbookId } = req.params;
    if (!email) return res.status(400).json({ error: "Email requis" });

    const invitation = await sendInvitation(req.user.id, cookbookId, email, role);
    res.status(201).json({ invitation });
  } catch (err) {
    const map = {
      FORBIDDEN: [403, "Seul le créateur peut inviter des membres"],
      USER_NOT_FOUND: [404, "Utilisateur introuvable"],
      ALREADY_MEMBER: [409, "Cet utilisateur est déjà membre"],
      ALREADY_INVITED: [409, "Une invitation est déjà en attente pour cet utilisateur"],
      CANNOT_INVITE_SELF: [400, "Vous ne pouvez pas vous inviter vous-même"],
    };
    const [status, message] = map[err.message] || [500, "Erreur serveur"];
    res.status(status).json({ error: message });
  }
}

export async function myInvitations(req, res) {
  try {
    const invitations = await getMyInvitations(req.user.id);
    res.json({ invitations });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function respond(req, res) {
  try {
    const { accept } = req.body;
    const invitation = await respondToInvitation(
      req.user.id,
      req.params.invitationId,
      accept === true || accept === "true"
    );
    res.json({ invitation });
  } catch (err) {
    if (err.message === "NOT_FOUND") {
      return res.status(404).json({ error: "Invitation introuvable" });
    }
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function pendingCount(req, res) {
  try {
    const count = await getPendingCount(req.user.id);
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
}
