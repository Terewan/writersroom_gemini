'use client'

import { Sidebar } from '@/components/layout/sidebar'
import { ReactNode } from 'react'

export function AppLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {children}
            </main>
        </div>
    )
}
