import api from './axios'

export const departmentApi = {
  getAll:        () =>
    api.get('/departments'),
  create:        (data) =>
    api.post('/departments', data),
  getPrograms:   (deptId) =>
    api.get(`/departments/${deptId}/programs`),
  getAllPrograms: () =>
    api.get('/programs'),
  createProgram: (data) =>
    api.post('/programs', data),
  getBatches:    (programId) =>
    api.get(`/programs/${programId}/batches`),
  createBatch:   (data) =>
    api.post('/batches', data),
  getSubjects:   (deptId) =>
    api.get(`/departments/${deptId}/subjects`),
  getSubjectsBySemester: (deptId, semester) =>
    api.get(
      `/departments/${deptId}/subjects/semester/${semester}`
    ),
  createSubject: (data) =>
    api.post('/subjects', data),
}