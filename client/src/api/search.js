import apiClient from "./client";

export const searchRecipes = (params) =>
  apiClient.get("/api/search", { params });
