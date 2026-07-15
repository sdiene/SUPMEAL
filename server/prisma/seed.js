// prisma/seed.js
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
async function main() {
  console.log('🌱 Début du peuplement (seeding) de la base de données...');
  const hashedPassword = await bcrypt.hash('Supmeal2026!', 10);
  console.log('👥 Création des utilisateurs...');
  const chef = await prisma.user.upsert({
    where: { email: 'chef@supmeal.fr' },
    update: {},
    create: {
      email: 'chef@supmeal.fr',
      name: 'Chef Supmeal',
      password: hashedPassword,
      diet: 'Omnivore',
      defaultPortions: 4,
    },
  });
  const commis = await prisma.user.upsert({
    where: { email: 'commis@supmeal.fr' },
    update: {},
    create: {
      email: 'commis@supmeal.fr',
      name: 'Commis de Cuisine',
      password: hashedPassword,
      diet: 'Omnivore',
      defaultPortions: 2,
    },
  });
  console.log('📚 Création du livre de recettes partagé...');
  const cookbook = await prisma.cookbook.create({
    data: {
      name: 'Les Secrets de Supmeal',
      description: 'Le livre de recettes partagé de la brigade.',
      isPublic: false,
    },
  });
  console.log('🔗 Association des utilisateurs au livre de recettes...');
  await prisma.cookbookMember.createMany({
    data: [
      {
        cookbookId: cookbook.id,
        userId: chef.id,
        role: Role.OWNER,
      },
      {
        cookbookId: cookbook.id,
        userId: commis.id,
        role: Role.EDITOR,
      },
    ],
    skipDuplicates: true,
  });
  console.log('🍳 Création d\'une recette par défaut...');
  await prisma.recipe.create({
    data: {
      title: 'Pâtes Carbonara Traditionnelles',
      prepTime: 10,
      cookTime: 15,
      servings: 4,
      source: 'https://www.italie-tradition.fr',
      isFavorite: true,
      isPublic: true,
      userId: chef.id,
      cookbookId: cookbook.id,
      ingredients: {
        create: [
          { name: 'Spaghetti', quantity: 400, unit: 'g' },
          { name: 'Guanciale (ou lardons)', quantity: 150, unit: 'g' },
          { name: 'Jaunes d\'œufs', quantity: 4, unit: 'pièces' },
          { name: 'Pecorino Romano râpé', quantity: 75, unit: 'g' },
          { name: 'Poivre noir moulu', quantity: 1, unit: 'pincée' },
        ],
      },
      steps: {
        create: [
          { order: 1, instruction: 'Faire cuire les spaghetti dans une grande casserole d\'eau salée.' },
          { order: 2, instruction: 'Pendant ce temps, faire dorer le guanciale coupé en morceaux dans une poêle sans matière grasse.' },
          { order: 3, instruction: 'Dans un bol, mélanger les jaunes d\'œufs avec le Pecorino Romano et beaucoup de poivre noir.' },
          { order: 4, instruction: 'Égoutter les pâtes en réservant une louche d\'eau de cuisson. Ajouter les pâtes au guanciale hors du feu.' },
          { order: 5, instruction: 'Verser la préparation aux œufs, ajouter un peu d\'eau de cuisson pour rendre crémeux, remuer vivement et servir aussitôt !' },
        ],
      },
    },
  });

  console.log('✅ Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur durant le seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });