import apiClient from "./client";
export const searchProfiles = (q) => apiClient.get("/api/profiles", { params: { q } });
export const getProfile = (userId) => apiClient.get(`/api/profiles/${userId}`);
export const toggleFollow = (userId) => apiClient.post(`/api/profiles/${userId}/follow`);
export const getFeed = () => apiClient.get("/api/profiles/feed");
