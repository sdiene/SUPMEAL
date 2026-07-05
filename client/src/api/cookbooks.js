import apiClient from "./client";
export const getCookbooks = () => apiClient.get("/api/cookbooks");
export const getCookbook = (id) => apiClient.get(`/api/cookbooks/${id}`);
export const createCookbook = (data) => apiClient.post("/api/cookbooks", data);
export const deleteCookbook = (id) => apiClient.delete(`/api/cookbooks/${id}`);
export const inviteMember = (cookbookId, email, role) =>
  apiClient.post(`/api/cookbooks/${cookbookId}/members`, { email, role });
export const updateMemberRole = (cookbookId, userId, role) =>
  apiClient.patch(`/api/cookbooks/${cookbookId}/members/${userId}`, { role });
export const removeMember = (cookbookId, userId) =>
  apiClient.delete(`/api/cookbooks/${cookbookId}/members/${userId}`);
export const getMessages = (cookbookId) =>
  apiClient.get(`/api/cookbooks/${cookbookId}/messages`);
export const postMessage = (cookbookId, content) =>
  apiClient.post(`/api/cookbooks/${cookbookId}/messages`, { content });
export const deleteMessage = (cookbookId, messageId) =>
  apiClient.delete(`/api/cookbooks/${cookbookId}/messages/${messageId}`);

export const addRecipeToCookbook = (cookbookId, recipeId) =>
  apiClient.post(`/api/cookbooks/${cookbookId}/recipes`, { recipeId });

export const toggleCookbookPublic = (cookbookId) =>
  apiClient.patch(`/api/cookbooks/${cookbookId}/public`);

export const getPublicCookbooks = (params) =>
  apiClient.get("/api/cookbooks/public", { params });

export const copyRecipeToMyRecipes = (recipeId) =>
  apiClient.post("/api/cookbooks/copy-recipe", { recipeId });
