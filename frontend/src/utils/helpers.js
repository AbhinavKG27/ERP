export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export const formatCurrency = (amount) => {
  if (amount == null) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0])
    .join('').toUpperCase().slice(0, 2)
}

export const getAttendanceColor = (pct) => {
  if (pct >= 85) return 'text-emerald-600'
  if (pct >= 75) return 'text-yellow-600'
  if (pct >= 65) return 'text-orange-500'
  return 'text-red-600'
}

export const getAttendanceBg = (pct) => {
  if (pct >= 85) return 'bg-emerald-50 text-emerald-700'
  if (pct >= 75) return 'bg-yellow-50 text-yellow-700'
  if (pct >= 65) return 'bg-orange-50 text-orange-700'
  return 'bg-red-50 text-red-700'
}

export const getGradeColor = (grade) => {
  const c = {
    'O': 'text-emerald-600', 'A+': 'text-green-600',
    'A': 'text-blue-600',    'B+': 'text-blue-500',
    'B': 'text-yellow-600',   'C': 'text-orange-600',
    'F': 'text-red-600',
  }
  return c[grade] || 'text-gray-600'
}

export const getRoleHomePath = (role) => {
  const paths = {
    ADMIN:         '/dashboard',
    HOD:           '/dashboard',
    FACULTY:       '/dashboard',
    STUDENT:       '/dashboard',
    FINANCE:       '/dashboard',
    LIBRARIAN:     '/library',
    HOSTEL_WARDEN: '/hostel',
    COE:           '/dashboard',
  }
  return paths[role] || '/dashboard'
}

export const getRoleLabel = (role) => {
  const labels = {
    ADMIN:         'Administrator',
    HOD:           'Head of Department',
    FACULTY:       'Faculty',
    STUDENT:       'Student',
    FINANCE:       'Finance Officer',
    LIBRARIAN:     'Librarian',
    HOSTEL_WARDEN: 'Hostel Warden',
    COE:           'Controller of Examinations',
  }
  return labels[role] || role
}