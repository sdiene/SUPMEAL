import { prisma } from "../lib/prisma.js";
export async function searchRecipes(userId, filters) {
  const {
    q,
    cookbookId,
    tags,
    ingredient,
    maxPrepTime,
    maxCookTime,
    favoritesOnly,
  } = filters;
  const accessibleCookbookIds = await prisma.cookbookMember
    .findMany({ where: { userId }, select: { cookbookId: true } })
    .then((rows) => rows.map((r) => r.cookbookId));
  const where = {
    AND: [
      {
        OR: [
          { userId },
          ...(accessibleCookbookIds.length
            ? [{ cookbookId: { in: accessibleCookbookIds } }]
            : []),
        ],
      },
    ],
  };
  if (cookbookId) {
    where.AND.push({ cookbookId });
  }
  if (q) {
    where.AND.push({ title: { contains: q, mode: "insensitive" } });
  }
  if (ingredient) {
    where.AND.push({
      ingredients: { some: { name: { contains: ingredient, mode: "insensitive" } } },
    });
  }
  if (tags) {
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (tagList.length) {
      where.AND.push({
        tags: { some: { tag: { name: { in: tagList } } } },
      });
    }
  }
  if (maxPrepTime) {
    where.AND.push({ prepTime: { lte: Number(maxPrepTime) } });
  }
  if (maxCookTime) {
    where.AND.push({ cookTime: { lte: Number(maxCookTime) } });
  }
  if (favoritesOnly === "true" || favoritesOnly === true) {
    where.AND.push({ isFavorite: true });
  }
  return prisma.recipe.findMany({
    where,
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
    orderBy: { createdAt: "desc" },
  });
}
