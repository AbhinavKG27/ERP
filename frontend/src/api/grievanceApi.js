import api from './axios'

export const grievanceApi = {
  submit:      (studentId, data) =>
    api.post(`/grievances/student/${studentId}`, data),
  getById:     (id) =>
    api.get(`/grievances/${id}`),
  getAll:      () =>
    api.get('/grievances'),
  getByStudent: (studentId) =>
    api.get(`/grievances/student/${studentId}`),
  getByFaculty: (facultyId) =>
    api.get(`/grievances/faculty/${facultyId}`),
  assign:      (id, data) =>
    api.put(`/grievances/${id}/assign`, data),
  escalate:    (id, hodId) =>
    api.put(`/grievances/${id}/escalate/${hodId}`),
  resolve:     (id, data) =>
    api.put(`/grievances/${id}/resolve`, data),
  addComment:  (grievanceId, commenterId, data) =>
    api.post(
      `/grievances/${grievanceId}/comments/${commenterId}`,
      data),
  getComments: (grievanceId) =>
    api.get(`/grievances/${grievanceId}/comments`),
}