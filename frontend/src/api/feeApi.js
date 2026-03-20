import api from './axios'

export const feeApi = {
  createStructure: (data) =>
    api.post('/fees/structures', data),

  assignFee:       (data) =>
    api.post('/fees/assign', data),

  makePayment:     (data) =>
    api.post('/fees/pay', data),

  getStudentFees:  (studentId, academicYear) =>
    api.get(`/fees/student/${studentId}`,
      { params: { academicYear } }),

  getPayments:     (studentId) =>
    api.get(`/fees/student/${studentId}/payments`),
}