import { BrowserRouter, Routes, Route, Navigate }
  from 'react-router-dom'
import { QueryClient, QueryClientProvider }
  from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore'

// Pages
import LoginPage from './pages/auth/LoginPage'
import DashboardLayout from './components/layout/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import StudentsPage from './pages/students/StudentsPage'
import FacultyPage from './pages/faculty/FacultyPage'
import AttendancePage from './pages/attendance/AttendancePage'
import ExamPage from './pages/exam/ExamPage'
import FeePage from './pages/fee/FeePage'
import LibraryPage from './pages/library/LibraryPage'
import HostelPage from './pages/hostel/HostelPage'
import GrievancePage from './pages/grievance/GrievancePage'
import NotificationsPage
  from './pages/notifications/NotificationsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
})

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '10px',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard"
              element={<DashboardHome />} />
            <Route path="students"
              element={<StudentsPage />} />
            <Route path="faculty"
              element={<FacultyPage />} />
            <Route path="attendance"
              element={<AttendancePage />} />
            <Route path="exam"
              element={<ExamPage />} />
            <Route path="fee"
              element={<FeePage />} />
            <Route path="library"
              element={<LibraryPage />} />
            <Route path="hostel"
              element={<HostelPage />} />
            <Route path="grievance"
              element={<GrievancePage />} />
            <Route path="notifications"
              element={<NotificationsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}