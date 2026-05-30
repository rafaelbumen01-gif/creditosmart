import api from "./apiClient";

export const authApi = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  profile: () => api.get("/auth/profile"),
};

export const clientsApi = {
  getAll: (params = "") => api.get(`/clients${params ? `?${params}` : ""}`),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post("/clients", data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

export const loansApi = {
  getAll: (params = "") => api.get(`/loans${params ? `?${params}` : ""}`),
  getById: (id) => api.get(`/loans/${id}`),
  create: (data) => api.post("/loans", data),
  update: (id, data) => api.put(`/loans/${id}`, data),
  delete: (id) => api.delete(`/loans/${id}`),
  simulate: (data) => api.post("/loans/simulate", data),
  dashboard: () => api.get("/loans/dashboard"),
  amortization: (id) => api.get(`/loans/${id}/amortization`),
};

export const paymentsApi = {
  getAll: () => api.get("/payments"),
  getByLoan: (loanId) => api.get(`/payments/loan/${loanId}`),
  create: (data) => api.post("/payments", data),
  stats: () => api.get("/payments/stats"),
};

export const notificationsApi = {
  getAll: () => api.get("/notifications"),
  create: (data) => api.post("/notifications", data),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/read-all"),
  unreadCount: () => api.get("/notifications/unread-count"),
};
