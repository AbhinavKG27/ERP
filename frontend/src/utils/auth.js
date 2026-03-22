export const normalizeRole = (rawRole) => {
  if (!rawRole) return null
  return String(rawRole).replace(/^ROLE_/, '').trim().toUpperCase()
}

export const getDefaultRouteByRole = (role) => {
  const normalized = normalizeRole(role)
  if (normalized === 'ADMIN') return '/admin/dashboard'
  if (normalized === 'FACULTY') return '/faculty/dashboard'
  if (normalized === 'STUDENT') return '/student/dashboard'
  return '/unauthorized'
}