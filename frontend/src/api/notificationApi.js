import api from './axios'

export const notificationApi = {
  send:           (createdById, data) =>
    api.post(`/notifications/send/${createdById}`, data),
  broadcast:      (createdById, data) =>
    api.post(
      `/notifications/broadcast/${createdById}`, data),
  getForUser:     (userId, role) =>
    api.get(`/notifications/user/${userId}`,
      { params: { role } }),
  getUnreadCount: (userId, role) =>
    api.get(
      `/notifications/user/${userId}/unread-count`,
      { params: { role } }),
  markAsRead:     (notificationId, userId) =>
    api.put(
      `/notifications/${notificationId}/read/${userId}`),
  markAllRead:    (userId, role) =>
    api.put(`/notifications/user/${userId}/read-all`,
      { params: { role } }),
}

