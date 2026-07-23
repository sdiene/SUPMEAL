import apiClient from "./client";
export const getRating = (recipeId) =>
  apiClient.get(`/api/recipes/${recipeId}/rating`);
export const rateRecipe = (recipeId, value) =>
  apiClient.post(`/api/recipes/${recipeId}/rating`, { value });
