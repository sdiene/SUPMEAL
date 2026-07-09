import { prisma } from "../lib/prisma.js";
import { getMemberRole } from "./cookbook.service.js";

export async function sendInvitation(invitedById, cookbookId, targetEmail, role) {
  const requesterRole = await getMemberRole(invitedById, cookbookId);
  if (requesterRole !== "OWNER") throw new Error("FORBIDDEN");

  const targetUser = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (!targetUser) throw new Error("USER_NOT_FOUND");

  if (targetUser.id === invitedById) throw new Error("CANNOT_INVITE_SELF");

  const alreadyMember = await prisma.cookbookMember.findUnique({
    where: { cookbookId_userId: { cookbookId, userId: targetUser.id } },
  });
  if (alreadyMember) throw new Error("ALREADY_MEMBER");

  const existing = await prisma.cookbookInvitation.findUnique({
    where: { cookbookId_invitedUserId: { cookbookId, invitedUserId: targetUser.id } },
  });
  if (existing?.status === "PENDING") throw new Error("ALREADY_INVITED");

  return prisma.cookbookInvitation.create({
    data: {
      cookbookId,
      invitedById,
      invitedUserId: targetUser.id,
      role: role || "READER",
      status: "PENDING",
    },
    include: {
      cookbook: { select: { id: true, name: true } },
      invitedBy: { select: { id: true, name: true, email: true } },
      invitedUser: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getMyInvitations(userId) {
  return prisma.cookbookInvitation.findMany({
    where: { invitedUserId: userId, status: "PENDING" },
    include: {
      cookbook: { select: { id: true, name: true, description: true } },
      invitedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function respondToInvitation(userId, invitationId, accept) {
  const invitation = await prisma.cookbookInvitation.findFirst({
    where: { id: invitationId, invitedUserId: userId, status: "PENDING" },
  });

  if (!invitation) throw new Error("NOT_FOUND");

  if (accept) {
    await prisma.cookbookMember.create({
      data: {
        cookbookId: invitation.cookbookId,
        userId,
        role: invitation.role,
      },
    });
  }

  return prisma.cookbookInvitation.update({
    where: { id: invitationId },
    data: { status: accept ? "ACCEPTED" : "REFUSED" },
  });
}

export async function getPendingCount(userId) {
  return prisma.cookbookInvitation.count({
    where: { invitedUserId: userId, status: "PENDING" },
  });
}
