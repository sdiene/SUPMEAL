import { prisma } from "../lib/prisma.js";
export async function getWeekPlan(userId, weekStart) {
  const start = new Date(weekStart);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return prisma.mealPlan.findMany({
    where: {
      userId,
      date: { gte: start, lt: end },
    },
    include: {
      recipe: {
        include: {
          tags: { include: { tag: true } },
        },
      },
    },
    orderBy: { date: "asc" },
  });
}
export async function addToMealPlan(userId, recipeId, date, mealType) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      OR: [
        { userId },
        { cookbook: { members: { some: { userId } } } },
        { isPublic: true },
      ],
    },
  });
  if (!recipe) throw new Error("NOT_FOUND");
  return prisma.mealPlan.create({
    data: {
      userId,
      recipeId,
      date: new Date(date),
      mealType: mealType || "DINNER",
    },
    include: {
      recipe: { include: { tags: { include: { tag: true } } } },
    },
  });
}
export async function removeFromMealPlan(userId, mealPlanId) {
  const entry = await prisma.mealPlan.findFirst({
    where: { id: mealPlanId, userId },
  });
  if (!entry) throw new Error("NOT_FOUND");

  await prisma.mealPlan.delete({ where: { id: mealPlanId } });
}
export async function generateShoppingList(userId, weekStart) {
  const plans = await getWeekPlan(userId, weekStart);
  const ingredientMap = {};

  for (const plan of plans) {
    const recipe = await prisma.recipe.findUnique({
      where: { id: plan.recipeId },
      include: { ingredients: true },
    });

    for (const ing of recipe?.ingredients || []) {
      const key = `${ing.name.toLowerCase()}__${ing.unit || ""}`;
      if (ingredientMap[key]) {
        ingredientMap[key].quantity = (ingredientMap[key].quantity || 0) + (ing.quantity || 0);
      } else {
        ingredientMap[key] = {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        };
      }
    }
  }
  return Object.values(ingredientMap);
}
