import { Router } from "express";
import { prisma } from "../lib/prisma.js";

const router = Router();

/**
 * @swagger
 * /api/public/recipes:
 *   get:
 *     summary: Lister les recettes publiques (accessible sans authentification)
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Recherche par titre
 *       - in: query
 *         name: tags
 *         schema: { type: string }
 *       - in: query
 *         name: ingredient
 *         schema: { type: string }
 *       - in: query
 *         name: maxPrepTime
 *         schema: { type: integer }
 *       - in: query
 *         name: maxCookTime
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Liste des recettes publiques
 */
router.get("/recipes", async (req, res) => {
  try {
    const { q, tags, ingredient, maxPrepTime, maxCookTime } = req.query;

    const where = { AND: [{ isPublic: true }] };

    if (q) where.AND.push({ title: { contains: q, mode: "insensitive" } });
    if (ingredient) where.AND.push({ ingredients: { some: { name: { contains: ingredient, mode: "insensitive" } } } });
    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
      if (tagList.length) where.AND.push({ tags: { some: { tag: { name: { in: tagList } } } } });
    }
    if (maxPrepTime) where.AND.push({ prepTime: { lte: Number(maxPrepTime) } });
    if (maxCookTime) where.AND.push({ cookTime: { lte: Number(maxCookTime) } });

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        ingredients: true,
        steps: true,
        tags: { include: { tag: true } },
        user: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ recipes, count: recipes.length });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * @swagger
 * /api/public/cookbooks:
 *   get:
 *     summary: Lister les cookbooks publics (accessible sans authentification)
 *     tags: [Public]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Liste des cookbooks publics
 */
router.get("/cookbooks", async (req, res) => {
  try {
    const { q } = req.query;
    const where = { AND: [{ isPublic: true }] };
    if (q) where.AND.push({ name: { contains: q, mode: "insensitive" } });

    const cookbooks = await prisma.cookbook.findMany({
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

    res.json({ cookbooks, count: cookbooks.length });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
