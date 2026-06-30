import { prisma } from "../lib/prisma.js";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
async function getAccessibleRecipes(userId, recipeIds) {
  const cookbookIds = await prisma.cookbookMember
    .findMany({ where: { userId }, select: { cookbookId: true } })
    .then((rows) => rows.map((r) => r.cookbookId));

  const accessFilter = {
    OR: [
      { userId },
      ...(cookbookIds.length ? [{ cookbookId: { in: cookbookIds } }] : []),
    ],
  };
  const where = recipeIds?.length
    ? { AND: [accessFilter, { id: { in: recipeIds } }] }
    : accessFilter;
  return prisma.recipe.findMany({
    where,
    include: {
      ingredients: true,
      steps: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      cookbook: { select: { name: true } },
    },
  });
}
function recipeToPlainObject(recipe) {
  return {
    title: recipe.title,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    source: recipe.source,
    isFavorite: recipe.isFavorite,
    cookbookName: recipe.cookbook?.name || null,
    ingredients: recipe.ingredients.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      unit: i.unit,
    })),
    steps: recipe.steps.map((s) => ({ order: s.order, instruction: s.instruction })),
    tags: recipe.tags.map((rt) => rt.tag.name),
  };
}
export async function exportAsJSON(userId, recipeIds) {
  const recipes = await getAccessibleRecipes(userId, recipeIds);
  return recipes.map(recipeToPlainObject);
}
export async function exportAsCSV(userId, recipeIds) {
  const recipes = await getAccessibleRecipes(userId, recipeIds);
  const rows = recipes.map((r) => {
    const plain = recipeToPlainObject(r);
    return {
      title: plain.title,
      prepTime: plain.prepTime ?? "",
      cookTime: plain.cookTime ?? "",
      servings: plain.servings ?? "",
      source: plain.source ?? "",
      isFavorite: plain.isFavorite,
      cookbookName: plain.cookbookName ?? "",
      ingredients: plain.ingredients.map((i) => `${i.quantity ?? ""} ${i.unit ?? ""} ${i.name}`.trim()).join(" | "),
      steps: plain.steps.map((s) => `${s.order}. ${s.instruction}`).join(" | "),
      tags: plain.tags.join(", "),
    };
  });

  return stringify(rows, {
    header: true,
    columns: [
      "title",
      "prepTime",
      "cookTime",
      "servings",
      "source",
      "isFavorite",
      "cookbookName",
      "ingredients",
      "steps",
      "tags",
    ],
  });
}
async function createRecipeFromPlainObject(userId, plain) {
  if (!plain.title) throw new Error("INVALID_RECIPE_DATA");
  return prisma.recipe.create({
    data: {
      title: plain.title,
      prepTime: plain.prepTime ? Number(plain.prepTime) : null,
      cookTime: plain.cookTime ? Number(plain.cookTime) : null,
      servings: plain.servings ? Number(plain.servings) : null,
      source: plain.source || null,
      isFavorite: plain.isFavorite === true || plain.isFavorite === "true",
      userId,
      ingredients: {
        create: (plain.ingredients || []).map((i) => ({
          name: i.name,
          quantity: i.quantity ? Number(i.quantity) : null,
          unit: i.unit || null,
        })),
      },
      steps: {
        create: (plain.steps || []).map((s, index) => ({
          order: s.order ?? index + 1,
          instruction: s.instruction,
        })),
      },
      tags: plain.tags?.length
        ? {
            create: plain.tags.map((tagName) => ({
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
  });
}
export async function importFromJSON(userId, jsonData) {
  const recipes = Array.isArray(jsonData) ? jsonData : [jsonData];
  const created = [];

  for (const recipe of recipes) {
    const result = await createRecipeFromPlainObject(userId, recipe);
    created.push(result);
  }

  return created;
}
export async function importFromCSV(userId, csvText) {
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });
  const created = [];
  for (const row of rows) {
    const ingredients = (row.ingredients || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const match = s.match(/^([\d.]+)?\s*(\S+)?\s*(.+)$/);
        return { quantity: match?.[1] || null, unit: match?.[2] || null, name: match?.[3] || s };
      });
    const steps = (row.steps || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s, index) => {
        const match = s.match(/^(\d+)\.\s*(.+)$/);
        return { order: match ? Number(match[1]) : index + 1, instruction: match ? match[2] : s };
      });
    const tags = (row.tags || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const plain = {
      title: row.title,
      prepTime: row.prepTime,
      cookTime: row.cookTime,
      servings: row.servings,
      source: row.source,
      isFavorite: row.isFavorite,
      ingredients,
      steps,
      tags,
    };
    const result = await createRecipeFromPlainObject(userId, plain);
    created.push(result);
  }
  return created;
}
