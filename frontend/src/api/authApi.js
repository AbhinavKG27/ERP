import api from './axios'

export const authApi = {
  login: (credentials) =>
    api.post('/auth/login', credentials),

  logout: (userId) =>
    api.post(`/auth/logout/${userId}`),

  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),

  changePassword: (userId, data) =>
    api.post(`/auth/change-password/${userId}`, data),
}