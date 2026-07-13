import apiClient from "./client";

export const getComments = (recipeId) =>
  apiClient.get(`/api/recipes/${recipeId}/comments`);

export const postComment = (recipeId, content) =>
  apiClient.post(`/api/recipes/${recipeId}/comments`, { content });

export const deleteComment = (recipeId, commentId) =>
  apiClient.delete(`/api/recipes/${recipeId}/comments/${commentId}`);
