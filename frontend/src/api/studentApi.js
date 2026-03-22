import api from './axios'

export const studentApi = {
  create:  (data) =>
    api.post('/students', data),
  getById: (id) =>
    api.get(`/students/${id}`),
  getAll:  (page = 0, size = 10) =>
    api.get('/students', { params: { page, size } }),
  search:  (query, page = 0) =>
    api.get('/students/search',
      { params: { q: query, page, size: 10 } }),
}