import { prisma } from "../lib/prisma.js";

export async function createCookbook(userId, { name, description }) {
  return prisma.cookbook.create({
    data: {
      name,
      description,
      members: {
        create: { userId, role: "OWNER" },
      },
    },
    include: { members: { include: { user: true } } },
  });
}

export async function getUserCookbooks(userId) {
  return prisma.cookbook.findMany({
    where: { members: { some: { userId } } },
    include: { members: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCookbookById(userId, cookbookId) {
  const cookbook = await prisma.cookbook.findFirst({
    where: { id: cookbookId, members: { some: { userId } } },
    include: {
      members: { include: { user: true } },
      recipes: { include: { ingredients: true, steps: true, tags: { include: { tag: true } } } },
    },
  });
  if (!cookbook) throw new Error("NOT_FOUND");
  return cookbook;
}

export async function getMemberRole(userId, cookbookId) {
  const member = await prisma.cookbookMember.findUnique({
    where: { cookbookId_userId: { cookbookId, userId } },
  });
  return member?.role ?? null;
}

export async function addMember(requesterId, cookbookId, targetEmail, role) {
  const requesterRole = await getMemberRole(requesterId, cookbookId);
  if (requesterRole !== "OWNER") throw new Error("FORBIDDEN");

  const targetUser = await prisma.user.findUnique({ where: { email: targetEmail } });
  if (!targetUser) throw new Error("USER_NOT_FOUND");

  const existing = await prisma.cookbookMember.findUnique({
    where: { cookbookId_userId: { cookbookId, userId: targetUser.id } },
  });
  if (existing) throw new Error("ALREADY_MEMBER");

  return prisma.cookbookMember.create({
    data: { cookbookId, userId: targetUser.id, role: role || "READER" },
    include: { user: true },
  });
}

export async function removeMember(requesterId, cookbookId, targetUserId) {
  const requesterRole = await getMemberRole(requesterId, cookbookId);
  if (requesterRole !== "OWNER") throw new Error("FORBIDDEN");
  if (requesterId === targetUserId) throw new Error("CANNOT_REMOVE_SELF");

  await prisma.cookbookMember.delete({
    where: { cookbookId_userId: { cookbookId, userId: targetUserId } },
  });
}

export async function updateMemberRole(requesterId, cookbookId, targetUserId, role) {
  const requesterRole = await getMemberRole(requesterId, cookbookId);
  if (requesterRole !== "OWNER") throw new Error("FORBIDDEN");

  return prisma.cookbookMember.update({
    where: { cookbookId_userId: { cookbookId, userId: targetUserId } },
    data: { role },
    include: { user: true },
  });
}

export async function deleteCookbook(requesterId, cookbookId) {
  const requesterRole = await getMemberRole(requesterId, cookbookId);
  if (requesterRole !== "OWNER") throw new Error("FORBIDDEN");

  await prisma.cookbook.delete({ where: { id: cookbookId } });
}
