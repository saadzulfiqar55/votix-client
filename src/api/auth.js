import api, { setAuthToken } from "./client";

export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data).then((res) => {
  const token = res.data?.accessToken || res.data?.token;
  if (token) setAuthToken(token);
  return res;
});
export const logout = () => api.post("/api/auth/logout");
export const refreshToken = () => api.post("/api/auth/refresh");
export const me = () => api.get("/api/auth/me");
export const verifyEmail = (token) => api.post("/api/auth/verify-email", { token });
export const forgotPassword = (email) => api.post("/api/auth/forgot-password", { email });
export const resetPassword = (token, password) => api.post("/api/auth/reset-password", { token, password });
export const getUsers = () => api.get("/api/admin/users");
export const updateUser = (id, data) => api.put(`/api/admin/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`);
export const getAuditLogs = () => api.get("/api/admin/audit-logs");
