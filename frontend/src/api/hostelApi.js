import api from './axios'

export const hostelApi = {
  createBlock:      (data) =>
    api.post('/hostel/blocks', data),
  getBlocks:        () =>
    api.get('/hostel/blocks'),
  createRoom:       (data) =>
    api.post('/hostel/rooms', data),
  getRooms:         (blockId) =>
    api.get(`/hostel/blocks/${blockId}/rooms`),
  getAvailable:     (gender) =>
    api.get('/hostel/rooms/available',
      { params: { gender } }),
  allotRoom:        (data) =>
    api.post('/hostel/allot', data),
  getStudentRoom:   (studentId, academicYear) =>
    api.get(`/hostel/student/${studentId}`,
      { params: { academicYear } }),
  vacateRoom:       (allotmentId) =>
    api.patch(`/hostel/allotments/${allotmentId}/vacate`),
  raiseMaintenance: (data) =>
    api.post('/hostel/maintenance', data),
  getOpenRequests:  () =>
    api.get('/hostel/maintenance/open'),
  resolveRequest:   (id) =>
    api.patch(`/hostel/maintenance/${id}/resolve`),
}