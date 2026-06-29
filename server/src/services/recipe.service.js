import { prisma } from "../lib/prisma.js";
export async function createRecipe(userId, data, imageUrl) {
  const { title, prepTime, cookTime, servings, source, ingredients, steps, tags } = data;
  return prisma.recipe.create({
    data: {
      title,
      prepTime: prepTime ? Number(prepTime) : null,
      cookTime: cookTime ? Number(cookTime) : null,
      servings: servings ? Number(servings) : null,
      source,
      imageUrl,
      userId,
      ingredients: {
        create: (ingredients || []).map((i) => ({
          name: i.name,
          quantity: i.quantity ? Number(i.quantity) : null,
          unit: i.unit || null,
        })),
      },
      steps: {
        create: (steps || []).map((s, index) => ({
          order: s.order ?? index + 1,
          instruction: s.instruction,
        })),
      },
      tags: tags?.length
        ? {
            create: tags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })),
          }
        : undefined,
    },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
  });
}
export async function getUserRecipes(userId) {
  return prisma.recipe.findMany({
    where: { userId },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });
}
export async function getRecipeById(userId, recipeId) {
  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, userId },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
  });
  if (!recipe) throw new Error("NOT_FOUND");
  return recipe;
}
export async function updateRecipe(userId, recipeId, data, imageUrl) {
  const existing = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!existing) throw new Error("NOT_FOUND");
  const { title, prepTime, cookTime, servings, source, isFavorite, ingredients, steps } = data;
  if (ingredients) {
    await prisma.ingredient.deleteMany({ where: { recipeId } });
  }
  if (steps) {
    await prisma.step.deleteMany({ where: { recipeId } });
  }
  return prisma.recipe.update({
    where: { id: recipeId },
    data: {
      title,
      prepTime: prepTime !== undefined ? Number(prepTime) : undefined,
      cookTime: cookTime !== undefined ? Number(cookTime) : undefined,
      servings: servings !== undefined ? Number(servings) : undefined,
      source,
      isFavorite,
      imageUrl: imageUrl ?? undefined,
      ingredients: ingredients
        ? { create: ingredients.map((i) => ({ name: i.name, quantity: i.quantity ? Number(i.quantity) : null, unit: i.unit || null })) }
        : undefined,
      steps: steps
        ? { create: steps.map((s, index) => ({ order: s.order ?? index + 1, instruction: s.instruction })) }
        : undefined,
    },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
  });
}
export async function deleteRecipe(userId, recipeId) {
  const existing = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!existing) throw new Error("NOT_FOUND"); 
  await prisma.recipe.delete({ where: { id: recipeId } });
}
export async function toggleFavorite(userId, recipeId) {
  const existing = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!existing) throw new Error("NOT_FOUND");
  return prisma.recipe.update({
    where: { id: recipeId },
    data: { isFavorite: !existing.isFavorite },
  });
}
