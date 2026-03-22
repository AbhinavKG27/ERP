import api from './axios'

export const examApi = {
  createExam:  (data) =>
    api.post('/exams', data),
  upsertMarks: (data) =>
    api.post('/exams/marks', data),
  getResults:  (studentId, academicYear, semesterNumber) =>
    api.get(`/exams/students/${studentId}/results`,
      { params: { academicYear, semesterNumber } }),
  revaluation: (data) =>
    api.post('/exams/revaluation', data),
}