import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

const getToken = () => {
  try {
    const raw = localStorage.getItem('apex-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.accessToken || null
  } catch {
    return null
  }
}

const getRefreshToken = () => {
  try {
    const raw = localStorage.getItem('apex-auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.refreshToken || null
  } catch {
    return null
  }
}

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401
        && !original._retry) {
      original._retry = true
      try {
        const refreshToken = getRefreshToken()
        const res = await axios.post(
          '/api/v1/auth/refresh',
          { refreshToken })
        const newToken = res.data.data.accessToken
        const raw = localStorage.getItem('apex-auth')
        const parsed = JSON.parse(raw)
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