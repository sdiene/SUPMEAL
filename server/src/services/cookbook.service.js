import { prisma } from "../lib/prisma.js";
const userSelect = {
  id: true,
  email: true,
  name: true,
  diet: true,
  allergies: true,
  defaultPortions: true,
  createdAt: true,
};
export async function createCookbook(userId, { name, description }) {
  return prisma.cookbook.create({
    data: {
      name,
      description,
      members: {
        create: { userId, role: "OWNER" },
      },
    },
    include: { members: { include: { user: { select: userSelect } } } },
  });
}
export async function getUserCookbooks(userId) {
  return prisma.cookbook.findMany({
    where: { members: { some: { userId } } },
    include: { members: { include: { user: { select: userSelect } } } },
    orderBy: { createdAt: "desc" },
  });
}
export async function getCookbookById(userId, cookbookId) {
  const cookbook = await prisma.cookbook.findFirst({
    where: { id: cookbookId, members: { some: { userId } } },
    include: {
      members: { include: { user: { select: userSelect } } },
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
    include: { user: { select: userSelect } },
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
    include: { user: { select: userSelect } },
  });
}
export async function deleteCookbook(requesterId, cookbookId) {
  const requesterRole = await getMemberRole(requesterId, cookbookId);
  if (requesterRole !== "OWNER") throw new Error("FORBIDDEN");

  await prisma.cookbook.delete({ where: { id: cookbookId } });
}

export async function addRecipeToCookbook(userId, cookbookId, recipeId) {
  const role = await getMemberRole(userId, cookbookId);
  if (!role || role === "READER" || role === "COMMENTER") throw new Error("FORBIDDEN");

  const original = await prisma.recipe.findFirst({
    where: { id: recipeId },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
  });
  if (!original) throw new Error("NOT_FOUND");

  return prisma.recipe.create({
    data: {
      title: original.title,
      prepTime: original.prepTime,
      cookTime: original.cookTime,
      servings: original.servings,
      source: original.source,
      imageUrl: original.imageUrl,
      cookbookId,
      userId: null,
      ingredients: {
        create: original.ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
        })),
      },
      steps: {
        create: original.steps.map((s) => ({
          order: s.order,
          instruction: s.instruction,
        })),
      },
      tags: original.tags.length ? {
        create: original.tags.map((rt) => ({
          tag: {
            connectOrCreate: {
              where: { name: rt.tag.name },
              create: { name: rt.tag.name },
            },
          },
        })),
      } : undefined,
    },
    include: { ingredients: true, steps: true, tags: { include: { tag: true } } },
  });
}

export async function toggleCookbookPublic(userId, cookbookId) {
  const role = await getMemberRole(userId, cookbookId);
  if (role !== "OWNER") throw new Error("FORBIDDEN");

  const cookbook = await prisma.cookbook.findUnique({ where: { id: cookbookId } });
  if (!cookbook) throw new Error("NOT_FOUND");

  return prisma.cookbook.update({
    where: { id: cookbookId },
    data: { isPublic: !cookbook.isPublic },
  });
}

export async function getPublicCookbooks(filters = {}) {
  const { q } = filters;
  const where = { AND: [{ isPublic: true }] };
  if (q) where.AND.push({ name: { contains: q, mode: "insensitive" } });

  return prisma.cookbook.findMany({
    where,
    include: {
      members: {
        where: { role: "OWNER" },
        include: { user: { select: { id: true, name: true } } },
      },
      recipes: {
        include: {
          ingredients: true,
          steps: true,
          tags: { include: { tag: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function copyRecipeToUser(userId, recipeId) {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    include: {
      ingredients: true,
      steps: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      cookbook: true,
    },
  });

  if (!recipe) throw new Error("NOT_FOUND");
  if (!recipe.cookbook?.isPublic && !recipe.isPublic) throw new Error("FORBIDDEN");

  return prisma.recipe.create({
    data: {
      title: recipe.title + " (copie)",
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servings: recipe.servings,
      source: recipe.source,
      imageUrl: recipe.imageUrl,
      userId,
      ingredients: {
        create: recipe.ingredients.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
        })),
      },
      steps: {
        create: recipe.steps.map((s) => ({
          order: s.order,
          instruction: s.instruction,
        })),
      },
      tags: recipe.tags.length ? {
        create: recipe.tags.map((rt) => ({
          tag: {
            connectOrCreate: {
              where: { name: rt.tag.name },
              create: { name: rt.tag.name },
            },
          },
        })),
      } : undefined,
    },
  });
}
