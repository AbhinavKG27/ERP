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

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password })
    const data = res.data.data
    setAuth(
      {
        id:       data.userId,
        fullName: data.fullName,
        email:    data.email,
        role:     data.role,
      },
      {
        accessToken:  data.accessToken,
        refreshToken: data.refreshToken,
      }
    )
    toast.success(`Welcome, ${data.fullName}!`)
    navigate(getRoleHomePath(data.role))
  }, [setAuth, navigate])

  const logoutUser = useCallback(async () => {
    try {
      if (user?.id) await authApi.logout(user.id)
    } catch {
      // Ignore API logout failures and clear local auth state.
    }
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }, [user, logout, navigate])

  return { login, logout: logoutUser,
           user, isAuthenticated }
}