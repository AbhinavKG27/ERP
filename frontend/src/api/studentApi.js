import api from './axios'

export const studentApi = {
  create:     (data) =>
    api.post('/students', data),

  getById:    (id) =>
    api.get(`/students/${id}`),

  getAll:     (page = 0, size = 20) =>
    api.get(`/students?page=${page}&size=${size}`),

  search:     (query, page = 0) =>
    api.get(`/students/search?q=${query}&page=${page}`),
}