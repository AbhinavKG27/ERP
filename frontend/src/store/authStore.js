import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,

      setAuth: (user, tokens) => {
        if (!tokens?.accessToken) {
          console.error('setAuth: no accessToken!', tokens)
          return
        }
        set({
          user,
          isAuthenticated: true,
          accessToken:     tokens.accessToken,
          refreshToken:    tokens.refreshToken || null,
        })
      },

      logout: () => set({
        user:            null,
        isAuthenticated: false,
        accessToken:     null,
        refreshToken:    null,
      }),

      updateToken: (accessToken) =>
        set({ accessToken }),
    }),
    {
      name: 'apex-auth',
      partialize: (s) => ({
        user:            s.user,
        accessToken:     s.accessToken,
        refreshToken:    s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore