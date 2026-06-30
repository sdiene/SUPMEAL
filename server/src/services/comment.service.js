import { prisma } from "../lib/prisma.js";
import { getMemberRole } from "./cookbook.service.js";
async function assertRecipeCommentAccess(userId, recipeId) {
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new Error("NOT_FOUND");
  if (recipe.userId) {
    if (recipe.userId !== userId) throw new Error("FORBIDDEN");
    return;
  }
  if (recipe.cookbookId) {
    const role = await getMemberRole(userId, recipe.cookbookId);
    if (!role || role === "READER") throw new Error("FORBIDDEN");
  }
}
export async function getComments(userId, recipeId) {
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new Error("NOT_FOUND");
  if (recipe.userId && recipe.userId !== userId) throw new Error("NOT_FOUND");
  if (recipe.cookbookId) {
    const role = await getMemberRole(userId, recipe.cookbookId);
    if (!role) throw new Error("NOT_FOUND");
  }
  return prisma.comment.findMany({
    where: { recipeId },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
}
export async function postComment(userId, recipeId, content) {
  if (!content?.trim()) throw new Error("EMPTY_CONTENT");
  await assertRecipeCommentAccess(userId, recipeId);

  return prisma.comment.create({
    data: { recipeId, userId, content: content.trim() },
    include: { user: { select: { id: true, name: true, email: true } } },
  });
}
export async function deleteComment(userId, commentId) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { recipe: true },
  });
  if (!comment) throw new Error("NOT_FOUND");
  if (comment.userId !== userId) {
    if (comment.recipe.cookbookId) {
      const role = await getMemberRole(userId, comment.recipe.cookbookId);
      if (role !== "OWNER") throw new Error("FORBIDDEN");
    } else {
      throw new Error("FORBIDDEN");
    }
  }
  await prisma.comment.delete({ where: { id: commentId } });
}
