-- CreateIndex
CREATE INDEX "Comment_recipeId_idx" ON "Comment"("recipeId");

-- CreateIndex
CREATE INDEX "CookbookInvitation_invitedUserId_idx" ON "CookbookInvitation"("invitedUserId");

-- CreateIndex
CREATE INDEX "CookbookMember_userId_idx" ON "CookbookMember"("userId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE INDEX "Ingredient_recipeId_idx" ON "Ingredient"("recipeId");

-- CreateIndex
CREATE INDEX "MealPlan_userId_idx" ON "MealPlan"("userId");

-- CreateIndex
CREATE INDEX "Message_cookbookId_idx" ON "Message"("cookbookId");

-- CreateIndex
CREATE INDEX "Recipe_userId_idx" ON "Recipe"("userId");

-- CreateIndex
CREATE INDEX "Recipe_cookbookId_idx" ON "Recipe"("cookbookId");

-- CreateIndex
CREATE INDEX "RecipeTag_tagId_idx" ON "RecipeTag"("tagId");

-- CreateIndex
CREATE INDEX "Step_recipeId_idx" ON "Step"("recipeId");
