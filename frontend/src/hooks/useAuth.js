import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import useAuthStore from '../store/authStore'
import { getRoleHomePath } from '../utils/helpers'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const { setAuth, logout, user, isAuthenticated }
    = useAuthStore()
  const navigate = useNavigate()

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await authApi.login(
          { email, password })

        // Handle different response structures
        const d = res.data?.data || res.data

        console.log('Login response:', d)

        if (!d || !d.accessToken) {
          toast.error('Login failed - invalid response')
          return
        }

        setAuth(
          {
            id:       d.userId,
            fullName: d.fullName,
            email:    d.email,
            role:     d.role,
          },
          {
            accessToken:  d.accessToken,
            refreshToken: d.refreshToken,
          }
        )

        toast.success(`Welcome, ${d.fullName}!`)
        navigate(getRoleHomePath(d.role))
      } catch (err) {
        console.error('Login error:', err)
        const msg = err?.response?.data?.message
          || 'Invalid email or password'
        toast.error(msg)
      }
    },
    [setAuth, navigate]
  )

  const logoutUser = useCallback(async () => {
    try {
      if (user?.id) await authApi.logout(user.id)
    } catch {}
    logout()
    navigate('/login')
    toast.success('Logged out')
  }, [user, logout, navigate])

  return {
    login,
    logout: logoutUser,
    user,
    isAuthenticated,
  }
}