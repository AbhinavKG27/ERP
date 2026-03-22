import { Routes, Route, Navigate }
  from 'react-router-dom'
import useAuthStore from '../store/authStore'
import DashboardLayout
  from '../components/layout/DashboardLayout'
import LoginPage
  from '../pages/auth/LoginPage'
import DashboardHome
  from '../pages/dashboard/DashboardHome'
import StudentsPage
  from '../pages/student/StudentsPage'
import FacultyPage
  from '../pages/faculty/FacultyPage'
import AttendancePage
  from '../pages/attendance/AttendancePage'
import ExamPage
  from '../pages/exam/ExamPage'
import FeePage
  from '../pages/fee/FeePage'
import HostelPage
  from '../pages/hostel/HostelPage'
import LibraryPage
  from '../pages/library/LibraryPage'
import GrievancePage
  from '../pages/grievance/GrievancePage'
import NotificationsPage
  from '../pages/notifications/NotificationsPage'
import UnauthorizedPage
  from '../pages/shared/UnauthorizedPage'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"
        element={<LoginPage />} />
      <Route path="/unauthorized"
        element={<UnauthorizedPage />} />
      <Route path="/"
        element={<Navigate to="/dashboard" />} />

      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard"
          element={<DashboardHome />} />
        <Route path="/students"
          element={<StudentsPage />} />
        <Route path="/faculty"
          element={<FacultyPage />} />
        <Route path="/attendance"
          element={<AttendancePage />} />
        <Route path="/exam"
          element={<ExamPage />} />
        <Route path="/fee"
          element={<FeePage />} />
        <Route path="/hostel"
          element={<HostelPage />} />
        <Route path="/library"
          element={<LibraryPage />} />
        <Route path="/grievance"
          element={<GrievancePage />} />
        <Route path="/notifications"
          element={<NotificationsPage />} />
      </Route>

      <Route path="*"
        element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}