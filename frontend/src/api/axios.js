import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

const AUTH_STORAGE_KEY = 'auth-storage'

// Read token from Zustand persisted storage
const getToken = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.accessToken || null
  } catch {
    return null
  }
}

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401
        && !original._retry) {
      original._retry = true
      try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY)
        const parsed = JSON.parse(raw)
        const refreshToken =
          parsed?.state?.refreshToken
        const res = await axios.post(
          '/api/v1/auth/refresh',
          { refreshToken })
        const newToken = res.data.data.accessToken

        // Update stored token
        parsed.state.accessToken = newToken
        localStorage.setItem(AUTH_STORAGE_KEY,
          JSON.stringify(parsed))

        original.headers.Authorization =
          `Bearer ${newToken}`
        return api(original)
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api