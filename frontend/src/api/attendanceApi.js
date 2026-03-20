import api from './axios'

export const attendanceApi = {
  createSession:   (data) =>
    api.post('/attendance/sessions', data),

  markAttendance:  (data) =>
    api.post('/attendance/mark', data),

  finalizeSession: (id) =>
    api.post(`/attendance/sessions/${id}/finalize`),

  getStudentSummary: (studentId, academicYear) =>
    api.get(`/attendance/student/${studentId}/summary`,
      { params: { academicYear } }),

  getSubjectSummary: (subjectId, academicYear) =>
    api.get(`/attendance/subject/${subjectId}/summary`,
      { params: { academicYear } }),
}