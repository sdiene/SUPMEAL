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

export const exportRecipes = (format, recipeIds) => {
  const params = new URLSearchParams({ format });
  if (recipeIds?.length) params.append("recipeIds", recipeIds.join(","));
  return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/export?${params}&token=${localStorage.getItem("token")}`;
};

export const importRecipes = (format, data) => {
  if (format === "csv") {
    return apiClient.post("/api/import?format=csv", { csv: data });
  }
  return apiClient.post("/api/import?format=json", { recipes: data });
};
