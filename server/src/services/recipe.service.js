import { prisma } from "../lib/prisma.js";
import { getMemberRole } from "./cookbook.service.js";
const ROLE_LEVELS = { READER: 1, COMMENTER: 2, EDITOR: 3, OWNER: 4 };
async function assertCookbookAccess(userId, cookbookId, minRole) {
  const role = await getMemberRole(userId, cookbookId);
  if (!role) throw new Error("FORBIDDEN");
  if (ROLE_LEVELS[role] < ROLE_LEVELS[minRole]) throw new Error("FORBIDDEN");
  return role;
}
export async function createRecipe(userId, data, imageUrl) {
  const { title, prepTime, cookTime, servings, source, ingredients, steps, tags, cookbookId } = data;

  if (cookbookId) {
    await assertCookbookAccess(userId, cookbookId, "EDITOR");
  }
  return prisma.recipe.create({
    data: {
      title,
      prepTime: prepTime ? Number(prepTime) : null,
      cookTime: cookTime ? Number(cookTime) : null,
      servings: servings ? Number(servings) : null,
      source,
      imageUrl,
      userId: cookbookId ? null : userId,
      cookbookId: cookbookId || null,
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
async function findAccessibleRecipe(userId, recipeId) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
  });
  if (!recipe) throw new Error("NOT_FOUND");

  if (recipe.userId && recipe.userId !== userId) throw new Error("NOT_FOUND");

  if (recipe.cookbookId) {
    const role = await getMemberRole(userId, recipe.cookbookId);
    if (!role) throw new Error("NOT_FOUND");
  }
  return recipe;
}
export async function getRecipeById(userId, recipeId) {
  return findAccessibleRecipe(userId, recipeId);
}
export async function updateRecipe(userId, recipeId, data, imageUrl) {
  const existing = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!existing) throw new Error("NOT_FOUND");

  if (existing.userId) {
    if (existing.userId !== userId) throw new Error("NOT_FOUND");
  } else if (existing.cookbookId) {
    await assertCookbookAccess(userId, existing.cookbookId, "EDITOR");
  }

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
  const existing = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!existing) throw new Error("NOT_FOUND");

  if (existing.userId) {
    if (existing.userId !== userId) throw new Error("NOT_FOUND");
  } else if (existing.cookbookId) {
    await assertCookbookAccess(userId, existing.cookbookId, "EDITOR");
  }

  await prisma.recipe.delete({ where: { id: recipeId } });
}
export async function toggleFavorite(userId, recipeId) {
  const recipe = await findAccessibleRecipe(userId, recipeId);

  return prisma.recipe.update({
    where: { id: recipeId },
    data: { isFavorite: !recipe.isFavorite },
  });
}

export async function togglePublic(userId, recipeId) {
  const recipe = await prisma.recipe.findFirst({ where: { id: recipeId, userId } });
  if (!recipe) throw new Error("NOT_FOUND");

  return prisma.recipe.update({
    where: { id: recipeId },
    data: { isPublic: !recipe.isPublic },
  });
}

