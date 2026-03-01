'use client'

import { useState } from 'react'
import { BookOpen, Users, SplitSquareHorizontal, Settings, FileText, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'summary' | 'characters' | 'rules' | 'themes' | 'proposals'

interface Proposal {
    id: string
    agentName: string
    agentColor: string
    category: string
    content: string
    status: 'pending' | 'approved' | 'rejected'
}

const MOCK_PROPOSALS: Proposal[] = [
    {
        id: 'p1',
        agentName: 'Aria (Showrunner)',
        agentColor: '#F59E0B',
        category: 'Character',
        content: 'Add a new flaw for the protagonist: They are terrified of deep water, which will complicate the underwater heist in Act 2.',
        status: 'pending'
    },
    {
        id: 'p2',
        agentName: 'Leo (Dialogue)',
        agentColor: '#3B82F6',
        category: 'World Rule',
        content: 'Magic can only be cast when the user is holding their breath. This adds physical stakes to every spell.',
        status: 'pending'
    }
]

export function ShowBible({ logline, coreHook, onLoglineChange, onHookChange }: { logline?: string, coreHook?: string, onLoglineChange?: (val: string) => void, onHookChange?: (val: string) => void }) {
    const [activeTab, setActiveTab] = useState<Tab>('summary')

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: 'summary', label: 'Premise', icon: <BookOpen className="w-4 h-4" /> },
        { id: 'characters', label: 'Characters', icon: <Users className="w-4 h-4" /> },
        { id: 'rules', label: 'World Rules', icon: <SplitSquareHorizontal className="w-4 h-4" /> },
        { id: 'themes', label: 'Themes', icon: <FileText className="w-4 h-4" /> },
        { id: 'proposals', label: 'Inbox (2)', icon: <CheckCircle2 className="w-4 h-4" /> },
    ]

    // Local state to track edits before saving
    const [localLogline, setLocalLogline] = useState(logline || '')
    const [localHook, setLocalHook] = useState(coreHook || '')
    const [savedState, setSavedState] = useState<'idle' | 'saved_logline' | 'saved_hook'>('idle')

    const handleSaveLogline = () => {
        onLoglineChange?.(localLogline)
        setSavedState('saved_logline')
        setTimeout(() => setSavedState('idle'), 2000)
    }

    const handleSaveHook = () => {
        onHookChange?.(localHook)
        setSavedState('saved_hook')
        setTimeout(() => setSavedState('idle'), 2000)
    }

    return (
        <div className="flex flex-col h-full bg-background border-l">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    The Show Bible
                </h2>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => window.print()}
                        className="p-2 hover:bg-muted rounded-full transition-colors group relative"
                        title="Export to PDF"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground group-hover:text-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                    </button>
                    <button className="p-2 hover:bg-muted rounded-full transition-colors" title="Settings">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                            activeTab === tab.id
                                ? "border-primary text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'summary' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold">Project Logline</h3>
                            {savedState === 'saved_logline' && (
                                <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Saved!
                                </span>
                            )}
                        </div>
                        <div className="p-0 rounded-t-lg border border-b-0 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                            <textarea
                                className="w-full h-24 p-4 bg-muted/30 text-lg italic text-muted-foreground leading-relaxed resize-none rounded-t-lg outline-none"
                                placeholder="Enter your project's logline here..."
                                value={localLogline}
                                onChange={(e) => setLocalLogline(e.target.value)}
                            />
                        </div>
                        <div className="bg-muted px-4 py-2 rounded-b-lg border border-t-0 flex justify-end">
                            <button
                                onClick={handleSaveLogline}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                            >
                                Save Logline to Room
                            </button>
                        </div>

                        <div className="flex items-center justify-between mt-8 mb-4">
                            <h3 className="text-xl font-bold">Core Hook</h3>
                            {savedState === 'saved_hook' && (
                                <span className="text-sm text-green-500 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4" /> Saved!
                                </span>
                            )}
                        </div>
                        <div className="p-0 rounded-t-lg border border-b-0 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                            <textarea
                                className="w-full h-32 p-4 bg-muted/10 text-foreground/80 leading-relaxed resize-none rounded-t-lg outline-none"
                                placeholder="Enter the core hook, themes, or visual style here..."
                                value={localHook}
                                onChange={(e) => setLocalHook(e.target.value)}
                            />
                        </div>
                        <div className="bg-muted px-4 py-2 rounded-b-lg border border-t-0 flex justify-end">
                            <button
                                onClick={handleSaveHook}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                            >
                                Save Hook to Room
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'proposals' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold">Proposed Updates</h3>
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                                2 Pending
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Review and approve ideas generated by the AI Writer's Room to permanently add them to the Show Bible.
                        </p>

                        {MOCK_PROPOSALS.map((proposal) => (
                            <div key={proposal.id} className="border rounded-lg p-4 space-y-3 bg-card shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: proposal.agentColor }}
                                        />
                                        <span className="text-sm font-medium text-foreground">
                                            {proposal.agentName}
                                        </span>
                                        <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                                            {proposal.category}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                                        Pending Review
                                    </span>
                                </div>

                                <p className="text-foreground/90 text-sm leading-relaxed border-l-2 pl-3 ml-1" style={{ borderColor: proposal.agentColor }}>
                                    {proposal.content}
                                </p>

                                <div className="flex gap-2 pt-2">
                                    <button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-1.5 rounded-md text-sm font-medium transition-colors">
                                        Approve & Add
                                    </button>
                                    <button className="flex-1 border hover:bg-destructive/10 hover:text-destructive hover:border-destructive py-1.5 rounded-md text-sm font-medium transition-colors">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {(activeTab === 'characters' || activeTab === 'rules' || activeTab === 'themes') && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                        <div>
                            <h3 className="text-lg font-medium">Empty Section</h3>
                            <p className="text-sm text-muted-foreground">Start chatting with the agents to populate this area.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
