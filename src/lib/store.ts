import { create } from 'zustand'

type ViewMode = 'room' | 'board'

interface AppState {
    currentProject: string | null
    setCurrentProject: (id: string | null) => void
    activeView: ViewMode
    setActiveView: (view: ViewMode) => void
    sidebarOpen: boolean
    toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
    currentProject: null,
    setCurrentProject: (id) => set({ currentProject: id }),
    activeView: 'room',
    setActiveView: (view) => set({ activeView: view }),
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
