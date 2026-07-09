import apiClient from "./client";

export const getMyInvitations = () => apiClient.get("/api/invitations");
export const getPendingCount = () => apiClient.get("/api/invitations/count");
export const respondToInvitation = (invitationId, accept) =>
  apiClient.post(`/api/invitations/${invitationId}/respond`, { accept });
export const sendInvitation = (cookbookId, email, role) =>
  apiClient.post(`/api/cookbooks/${cookbookId}/invite`, { email, role });
