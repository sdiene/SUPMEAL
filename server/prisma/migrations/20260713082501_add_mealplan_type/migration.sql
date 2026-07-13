-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK');

-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN     "mealType" "MealType" NOT NULL DEFAULT 'DINNER';
