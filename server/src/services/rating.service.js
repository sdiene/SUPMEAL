import { prisma } from "../lib/prisma.js";
export async function rateRecipe(userId, recipeId, value) {
  if (value < 1 || value > 5) throw new Error("INVALID_RATING");
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) throw new Error("NOT_FOUND");
  const rating = await prisma.rating.upsert({
    where: { recipeId_userId: { recipeId, userId } },
    update: { value },
    create: { recipeId, userId, value },
  });
  const stats = await getRecipeRating(recipeId);
  return { rating, ...stats };
}
export async function getRecipeRating(recipeId) {
  const result = await prisma.rating.aggregate({
    where: { recipeId },
    _avg: { value: true },
    _count: { value: true },
  });
  return {
    average: result._avg.value ? Math.round(result._avg.value * 10) / 10 : null,
    count: result._count.value,
  };
}
export async function getUserRating(userId, recipeId) {
  const rating = await prisma.rating.findUnique({
    where: { recipeId_userId: { recipeId, userId } },
  });
  return rating?.value || null;
}
