'use client'

import { useAppStore } from '@/lib/store'
import {
    BookOpen,
    LayoutDashboard,
    MessageSquare,
    Settings,
    Users,
    PanelLeftClose,
    PanelLeft,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
    { href: '/room', label: "Writer's Room", icon: MessageSquare },
    { href: '/board', label: 'Beat Board', icon: LayoutDashboard },
    { href: '/characters', label: 'Characters', icon: Users },
    { href: '/bible', label: 'Show Bible', icon: BookOpen },
    { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()
    const { sidebarOpen, toggleSidebar } = useAppStore()

    return (
        <aside
            className={cn(
                'group relative flex flex-col border-r bg-background transition-all duration-300',
                sidebarOpen ? 'w-64' : 'w-[70px]'
            )}
        >
            <div className="flex h-14 items-center border-b px-4">
                {sidebarOpen && <span className="text-lg font-bold tracking-tight">The Room</span>}
                <button
                    onClick={toggleSidebar}
                    className={cn(
                        'ml-auto rounded-md p-1.5 hover:bg-muted text-muted-foreground transition-colors',
                        !sidebarOpen && 'mx-auto ml-1'
                    )}
                >
                    {sidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 space-y-1 p-2">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-secondary text-secondary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                !sidebarOpen && 'justify-center px-0'
                            )}
                            title={!sidebarOpen ? item.label : undefined}
                        >
                            <Icon size={18} className="shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t p-4">
                {/* User profile / Auth state will go here */}
                {sidebarOpen ? (
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            SR
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Showrunner</span>
                            <span className="text-xs text-muted-foreground">Studio Account</span>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        SR
                    </div>
                )}
            </div>
        </aside>
    )
}
