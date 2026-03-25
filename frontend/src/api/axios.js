import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

const getToken = () => {
  try {
    // Try zustand persisted store first
    const raw = localStorage.getItem('apex-auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      const token = parsed?.state?.accessToken
      if (token) return token
    }
    // Fallback to direct key
    const direct = localStorage.getItem('accessToken')
    if (direct) return direct
    return null
  } catch {
    return null
  }
}

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthRoute =
      original?.url?.includes('/auth/login')
      || original?.url?.includes('/auth/refresh')

    if (error.response?.status === 401
        && !original?._retry
        && !isAuthRoute) {
      original._retry = true
      try {
        const raw =
          localStorage.getItem('apex-auth')
        const parsed = raw ? JSON.parse(raw) : null
        const refreshToken =
          parsed?.state?.refreshToken
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || '/api/v1'}/auth/refresh`,
          { refreshToken })
        const newToken = res.data?.data?.accessToken
          || res.data?.accessToken
        if (!newToken) {
          throw new Error('Invalid refresh response')
        }
        parsed.state.accessToken = newToken
        localStorage.setItem('apex-auth',
          JSON.stringify(parsed))
        original.headers.Authorization =
          `Bearer ${newToken}`
        return api(original)
      } catch {
        localStorage.removeItem('apex-auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api