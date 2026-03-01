import { create } from 'zustand'

type ViewMode = 'room' | 'board'

interface AppState {
    currentProject: string | null
    setCurrentProject: (id: string | null) => void
    activeView: ViewMode
    setActiveView: (view: ViewMode) => void
    sidebarOpen: boolean
    toggleSidebar: () => void

    // Global Show Bible State
    globalLogline: string
    globalHook: string
    setGlobalLogline: (logline: string) => void
    setGlobalHook: (hook: string) => void
    initializeStore: () => void
}

export const useAppStore = create<AppState>((set) => ({
    currentProject: null,
    setCurrentProject: (id) => set({ currentProject: id }),
    activeView: 'room',
    setActiveView: (view) => set({ activeView: view }),
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    globalLogline: "",
    globalHook: "",
    setGlobalLogline: (logline) => {
        set({ globalLogline: logline })
        if (typeof window !== 'undefined') localStorage.setItem('WRITERS_ROOM_LOGLINE', logline)
    },
    setGlobalHook: (hook) => {
        set({ globalHook: hook })
        if (typeof window !== 'undefined') localStorage.setItem('WRITERS_ROOM_HOOK', hook)
    },
    initializeStore: () => {
        if (typeof window !== 'undefined') {
            const storedLogline = localStorage.getItem('WRITERS_ROOM_LOGLINE')
            const storedHook = localStorage.getItem('WRITERS_ROOM_HOOK')
            if (storedLogline) set({ globalLogline: storedLogline })
            if (storedHook) set({ globalHook: storedHook })
        }
    }
}))
