import api from './api';

// ============================================================
// CITIZEN SERVICE — wraps existing backend endpoints
// All routes go through API gateway at port 3000
// ============================================================

// Helper: unwrap API response (some endpoints return {data}, some return raw)
const unwrap = (r) => (r.data && typeof r.data === 'object' && 'data' in r.data ? r.data.data : r.data);

export const citizenService = {
  // --- Profile ---
  getProfile: () => api.get('/api/users/profile').then(unwrap),
  getProfileWithStats: () => api.get('/api/users/profile-with-stats').then(unwrap),
  updateProfile: (data) => api.put('/api/users/profile', data).then(unwrap),
  changePassword: (data) => api.post('/api/users/change-password', data).then(unwrap),

  // --- Signalements ---
  getMySignalements: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.limit) params.append('limit', filters.limit);
    const qs = params.toString();
    return api.get(`/api/routes/signalements${qs ? `?${qs}` : ''}`).then((r) => {
      // service-routes wraps as { success, data: { data: [...], pagination } }
      const body = r.data;
      if (body?.data?.data) return body.data.data;
      if (body?.data) return body.data;
      return body;
    });
  },
  getSignalementById: (id) =>
    api.get(`/api/routes/signalements/${id}`).then((r) => r.data?.data?.data ?? r.data?.data ?? r.data),
  getSignalementHistory: (id) =>
    api.get(`/api/routes/signalements/${id}/historique`).then((r) => r.data?.data ?? r.data),
  getSignalementTypes: () => api.get('/api/routes/signalements/types').then((r) => r.data?.data ?? r.data),
  createSignalement: (data) => api.post('/api/routes/signalements', data).then((r) => r.data?.data ?? r.data),

  // --- Containers ---
  getContainers: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    params.append('limit', filters.limit || '200');
    return api.get(`/api/containers?${params}`).then((r) => r.data?.data ?? r.data);
  },
  getContainerById: (id) => api.get(`/api/containers/id/${id}`).then((r) => r.data?.data ?? r.data),

  // --- Gamification ---
  getMyStats: (userId) =>
    api.get(`/api/gamification/stats/utilisateurs/${userId}/stats`).then((r) => r.data?.data ?? r.data),
  getDefis: () =>
    api.get('/api/gamification/defis').then((r) => r.data?.data ?? r.data),
  getBadges: () =>
    api.get('/api/gamification/badges').then((r) => r.data?.data ?? r.data),
  getMyBadges: (userId) =>
    api.get(`/api/gamification/badges/utilisateurs/${userId}`).then((r) => r.data?.data ?? r.data),
  getClassement: (limit = 10) =>
    api.get(`/api/gamification/classement?limit=${limit}`).then((r) => r.data?.data ?? r.data),

  // --- Notifications ---
  getNotifications: () => api.get('/notifications').then((r) => r.data?.data ?? r.data),
  markNotificationRead: (id) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
};
