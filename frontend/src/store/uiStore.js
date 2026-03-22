import { create } from 'zustand'

const useUiStore = create((set) => ({
  globalLoading: false,
  setGlobalLoading: (value) => set({ globalLoading: value }),
}))

export default useUiStore