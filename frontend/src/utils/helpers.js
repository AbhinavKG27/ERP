// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

// Format currency in INR
export const formatCurrency = (amount) => {
  if (amount == null) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Get initials from full name
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Get attendance status color
export const getAttendanceColor = (percentage) => {
  if (percentage >= 85) return 'text-green-600'
  if (percentage >= 75) return 'text-yellow-600'
  if (percentage >= 65) return 'text-orange-600'
  return 'text-red-600'
}

// Get grade color
export const getGradeColor = (grade) => {
  const colors = {
    O:  'text-green-600',
    'A+': 'text-green-500',
    A:  'text-blue-600',
    'B+': 'text-blue-500',
    B:  'text-yellow-600',
    C:  'text-orange-600',
    F:  'text-red-600',
  }
  return colors[grade] || 'text-gray-600'
}

// Role-based redirect paths
export const getRoleHomePath = (role) => {
  const paths = {
    ADMIN:          '/dashboard/admin',
    HOD:            '/dashboard/hod',
    FACULTY:        '/dashboard/faculty',
    STUDENT:        '/dashboard/student',
    FINANCE:        '/dashboard/finance',
    LIBRARIAN:      '/dashboard/library',
    HOSTEL_WARDEN:  '/dashboard/hostel',
    COE:            '/dashboard/coe',
  }
  return paths[role] || '/dashboard'
}