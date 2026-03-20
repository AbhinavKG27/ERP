import api from './axios'

export const facultyApi = {
  create:         (data) => api.post('/faculty', data),
  getById:        (id) => api.get(`/faculty/${id}`),
  getByDept:      (deptId, page = 0) =>
    api.get(`/faculty/department/${deptId}?page=${page}`),
  assignSubject:  (data) => api.post('/faculty/assign', data),
  getAssignments: (facultyId, year) =>
    api.get(`/faculty/${facultyId}/assignments?academicYear=${year}`),
}