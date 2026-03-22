import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate }
  from 'react-router-dom'
import useAuthStore from '../store/authStore'
import DashboardLayout
  from '../components/layout/DashboardLayout'
import Loader from '../components/ui/Loader'

const LoginPage = lazy(() =>
  import('../pages/auth/LoginPage'))
const DashboardHome = lazy(() =>
  import('../pages/dashboard/DashboardHome'))
const StudentsPage = lazy(() =>
  import('../pages/student/StudentsPage'))
const FacultyPage = lazy(() =>
  import('../pages/faculty/FacultyPage'))
const AttendancePage = lazy(() =>
  import('../pages/attendance/AttendancePage'))
const ExamPage = lazy(() =>
  import('../pages/exam/ExamPage'))
const FeePage = lazy(() =>
  import('../pages/fee/FeePage'))
const HostelPage = lazy(() =>
  import('../pages/hostel/HostelPage'))
const LibraryPage = lazy(() =>
  import('../pages/library/LibraryPage'))
const GrievancePage = lazy(() =>
  import('../pages/grievance/GrievancePage'))
const FeedbackPage = lazy(() =>
  import('../pages/feedback/FeedbackPage'))
const NotificationsPage = lazy(() =>
  import('../pages/notifications/NotificationsPage'))
const UnauthorizedPage = lazy(() =>
  import('../pages/shared/UnauthorizedPage'))

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />
}

export default function AppRoutes() {
  const withSuspense = (component) => (
    <Suspense
      fallback={<Loader text="Loading page..." />}>
      {component}
    </Suspense>
  )

  return (
    <Routes>
      <Route path="/login"
        element={withSuspense(<LoginPage />)} />
      <Route path="/unauthorized"
        element={withSuspense(<UnauthorizedPage />)} />
      <Route path="/"
        element={<Navigate to="/dashboard" />} />

      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard"
          element={withSuspense(<DashboardHome />)} />
        <Route path="/students"
          element={withSuspense(<StudentsPage />)} />
        <Route path="/faculty"
          element={withSuspense(<FacultyPage />)} />
        <Route path="/attendance"
          element={withSuspense(<AttendancePage />)} />
        <Route path="/exam"
          element={withSuspense(<ExamPage />)} />
        <Route path="/fee"
          element={withSuspense(<FeePage />)} />
        <Route path="/hostel"
          element={withSuspense(<HostelPage />)} />
        <Route path="/library"
          element={withSuspense(<LibraryPage />)} />
        <Route path="/grievance"
          element={withSuspense(<GrievancePage />)} />
        <Route path="/feedback"
          element={withSuspense(<FeedbackPage />)} />
        <Route path="/notifications"
          element={withSuspense(<NotificationsPage />)} />
      </Route>

      <Route path="*"
        element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}