import api from './axios'

export const authApi = {
  login: (data) =>
    api.post('/auth/login', data),
  logout: () =>
    api.post('/auth/logout'),
  refresh: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),
  changePassword: (data) =>
    api.post('/auth/change-password', data),
}