import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (userData, tokens) => set({
        user:            userData,
        accessToken:     tokens.accessToken,
        refreshToken:    tokens.refreshToken,
        isAuthenticated: true,
      }),

      logout: () => {
        localStorage.removeItem('auth-storage')
        set({
          user:            null,
          accessToken:     null,
          refreshToken:    null,
          isAuthenticated: false,
        })
      },

      updateToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore