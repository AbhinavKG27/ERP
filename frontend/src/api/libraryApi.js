import api from './axios'

export const libraryApi = {
  addBook:      (data) =>
    api.post('/library/books', data),
  getBooks:     (page = 0) =>
    api.get('/library/books',
      { params: { page } }),
  searchBooks:  (query, page = 0) =>
    api.get('/library/books/search',
      { params: { query, page } }),
  getAvailable: (page = 0) =>
    api.get('/library/books/available',
      { params: { page } }),
  issueBook:    (data) =>
    api.post('/library/issue', data),
  returnBook:   (issueId) =>
    api.patch(`/library/return/${issueId}`),
  getUserBooks: (userId) =>
    api.get(`/library/user/${userId}/books`),
  getOverdue:   () =>
    api.get('/library/books/overdue'),
  reserveBook:  (bookId) =>
    api.post(`/library/books/${bookId}/reserve`),
}