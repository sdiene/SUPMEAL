import { prisma } from "../lib/prisma.js";

export async function searchProfiles(query) {
  return prisma.user.findMany({
    where: {
      name: { contains: query || "", mode: "insensitive" },
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          recipes: { where: { isPublic: true } },
          followers: true,
          following: true,
        },
      },
    },
    orderBy: { name: "asc" },
    take: 20,
  });
}

export async function getPublicProfile(userId, viewerId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: {
        select: {
          recipes: { where: { isPublic: true } },
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) throw new Error("NOT_FOUND");

  const recipes = await prisma.recipe.findMany({
    where: { userId, isPublic: true },
    include: {
      ingredients: true,
      steps: true,
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const cookbooks = await prisma.cookbook.findMany({
    where: {
      isPublic: true,
      members: { some: { userId, role: "OWNER" } },
    },
    include: {
      members: {
        where: { role: "OWNER" },
        include: { user: { select: { id: true, name: true } } },
      },
      recipes: {
        where: { isPublic: true },
        include: { tags: { include: { tag: true } } },
      },
    },
  });

  const isFollowing = viewerId
    ? !!(await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: viewerId, followingId: userId },
        },
      }))
    : false;

  return { user, recipes, cookbooks, isFollowing };
}

export async function followUser(followerId, followingId) {
  if (followerId === followingId) throw new Error("CANNOT_FOLLOW_SELF");

  const target = await prisma.user.findUnique({ where: { id: followingId } });
  if (!target) throw new Error("NOT_FOUND");

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });

  if (existing) {
    await prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } },
    });
    return { following: false };
  }

  await prisma.follow.create({ data: { followerId, followingId } });
  return { following: true };
}

export async function getFollowingFeed(userId) {
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  const followingIds = following.map((f) => f.followingId);
  if (!followingIds.length) return [];

  return prisma.recipe.findMany({
    where: { userId: { in: followingIds }, isPublic: true },
    include: {
      user: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
