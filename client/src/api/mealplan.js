import apiClient from "./client";
export const getWeekPlan = (weekStart) =>
  apiClient.get("/api/mealplan", { params: { weekStart } });
export const addToMealPlan = (recipeId, date, mealType) =>
  apiClient.post("/api/mealplan", { recipeId, date, mealType });
export const removeFromMealPlan = (id) =>
  apiClient.delete(`/api/mealplan/${id}`);
export const getShoppingList = (weekStart) =>
  apiClient.get("/api/mealplan/shopping-list", { params: { weekStart } });
