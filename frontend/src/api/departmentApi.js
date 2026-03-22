import api from './axios'

export const departmentApi = {
  getAll:        () =>
    api.get('/departments'),
  create:        (data) =>
    api.post('/departments', data),
  getPrograms:   (deptId) =>
    api.get(`/programs/department/${deptId}`),
  createProgram: (data) =>
    api.post('/programs', data),
  getBatches:    (programId) =>
    api.get(`/batches/program/${programId}`),
  createBatch:   (data) =>
    api.post('/batches', data),
  getSubjects:   (deptId) =>
    api.get(`/subjects/department/${deptId}`),
  createSubject: (data) =>
    api.post('/subjects', data),
}