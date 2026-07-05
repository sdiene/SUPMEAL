import apiClient from "./client";
export const getRecipes = () => apiClient.get("/api/recipes");
export const getRecipe = (id) => apiClient.get(`/api/recipes/${id}`);
export const createRecipe = (formData) =>
  apiClient.post("/api/recipes", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateRecipe = (id, formData) =>
  apiClient.put(`/api/recipes/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteRecipe = (id) => apiClient.delete(`/api/recipes/${id}`);
export const toggleFavorite = (id) => apiClient.patch(`/api/recipes/${id}/favorite`);
export const togglePublic = (id) => apiClient.patch(`/api/recipes/${id}/public`);
export const getPublicRecipes = (params) =>
  apiClient.get("/api/public/recipes", { params });
