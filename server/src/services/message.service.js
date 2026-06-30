import { prisma } from "../lib/prisma.js";
import { getMemberRole } from "./cookbook.service.js";
export async function getMessages(userId, cookbookId) {
  const role = await getMemberRole(userId, cookbookId);
  if (!role) throw new Error("FORBIDDEN");
  return prisma.message.findMany({
    where: { cookbookId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
}
export async function postMessage(userId, cookbookId, content) {
  const role = await getMemberRole(userId, cookbookId);
  if (!role) throw new Error("FORBIDDEN");
  if (!content?.trim()) throw new Error("EMPTY_CONTENT");
  return prisma.message.create({
    data: { cookbookId, userId, content: content.trim() },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}
export async function deleteMessage(userId, messageId) {
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) throw new Error("NOT_FOUND");
  if (message.userId !== userId) {
    const role = await getMemberRole(userId, message.cookbookId);
    if (role !== "OWNER") throw new Error("FORBIDDEN");
  }
  await prisma.message.delete({ where: { id: messageId } });
}
