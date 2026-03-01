'use client'

import { useChat } from '@ai-sdk/react'
import { useState, useRef, useEffect } from 'react'
import { Send, User, AlertCircle, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatAgent {
    id: string
    name: string
    role: string
    color: string
    provider: string
    model: string
    prompt: string
}

const MOCK_AGENTS: ChatAgent[] = [
    { id: '1', name: 'Dr. Aris', role: 'Science Advisor', color: 'bg-blue-500', provider: 'openai', model: 'gpt-4o-mini', prompt: 'You are Dr. Aris, a meticulous astrophysicist. You poke holes in the science of the plot.' },
    { id: '2', name: 'Sarah', role: 'Character Specialist', color: 'bg-rose-500', provider: 'anthropic', model: 'claude-3-5-sonnet-20240620', prompt: 'You are Sarah, a character psychology expert. You focus purely on emotional motivations and arcs.' },
]

export function WritersRoomChat() {
    const [activeAgentId, setActiveAgentId] = useState<string>(MOCK_AGENTS[0].id)
    const [roundsTotal, setRoundsTotal] = useState<number>(3)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const activeAgent = MOCK_AGENTS.find(a => a.id === activeAgentId)

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        body: {
            agentConfig: {
                provider: activeAgent?.provider,
                model: activeAgent?.model,
                systemPrompt: activeAgent?.prompt,
                name: activeAgent?.name
            }
        }
    })

    // Auto-scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex flex-col h-full w-full bg-background border-r">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div>
                    <h2 className="text-lg font-semibold">The Room</h2>
                    <p className="text-sm text-muted-foreground">Brainstorming Session Phase 1</p>
                </div>

                {/* Autonomy Dial */}
                <div className="flex items-center gap-2 bg-muted p-1.5 rounded-md">
                    <span className="text-xs font-medium px-2">Autonomy:</span>
                    <select
                        value={roundsTotal}
                        onChange={(e) => setRoundsTotal(Number(e.target.value))}
                        className="text-sm bg-background border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary"
                    >
                        <option value={1}>1 Round (Manual)</option>
                        <option value={3}>3 Rounds</option>
                        <option value={5}>5 Rounds</option>
                    </select>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
                        <MessageSquare size={48} className="opacity-20" />
                        <p className="text-sm">The room is quiet. Pitch an idea to get started.</p>
                    </div>
                )}

                {messages.map((m, i) => {
                    const isUser = m.role === 'user'

                    return (
                        <div key={m.id} className={cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "")}>
                            <div className={cn(
                                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white",
                                isUser ? "bg-primary" : activeAgent?.color || "bg-zinc-600"
                            )}>
                                {isUser ? <User size={16} /> : <span className="text-xs font-bold">{activeAgent?.name.charAt(0)}</span>}
                            </div>

                            <div className={cn(
                                "flex flex-col gap-1",
                                isUser ? "items-end" : "items-start"
                            )}>
                                <span className="text-xs font-medium text-muted-foreground">
                                    {isUser ? 'Showrunner (You)' : activeAgent?.name}
                                </span>

                                <div className={cn(
                                    "px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap",
                                    isUser
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "bg-muted text-foreground rounded-tl-sm"
                                )}>
                                    {m.content}
                                </div>

                                {/* Tool Invocations visually represented */}
                                {m.toolInvocations?.map((tool: any) => (
                                    <div key={tool.toolCallId} className="flex items-start gap-2 text-xs text-muted-foreground mt-2 bg-secondary/50 p-2 rounded-md border">
                                        <AlertCircle size={14} className="mt-0.5 text-orange-500" />
                                        {tool.toolName === 'propose_bible_update' && <span>Proposed an update to the Show Bible.</span>}
                                        {tool.toolName === 'query_show_bible' && <span>Consulted the Assistant Memory for context.</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
                {isLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm ml-11">
                        <span className="animate-pulse">●</span>
                        <span className="animate-pulse animation-delay-200">●</span>
                        <span className="animate-pulse animation-delay-400">●</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                        <span className="text-xs text-muted-foreground font-medium">Directing:</span>
                        <div className="flex gap-1.5 flex-wrap">
                            {MOCK_AGENTS.map(agent => (
                                <button
                                    key={agent.id}
                                    type="button"
                                    onClick={() => setActiveAgentId(agent.id)}
                                    className={cn(
                                        "text-xs px-2.5 py-1 rounded-full border transition-colors",
                                        activeAgentId === agent.id
                                            ? `${agent.color} bg-opacity-20 border-${agent.color.replace('bg-', '')}`
                                            : "hover:bg-muted bg-transparent border-transparent"
                                    )}
                                >
                                    {agent.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative flex items-center">
                        <input
                            className="w-full bg-muted border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-full pl-4 pr-12 py-3 text-sm transition-all outline-none"
                            placeholder={`Pitch to ${activeAgent?.name}...`}
                            value={input}
                            onChange={handleInputChange}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="absolute right-2 p-1.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={16} className="ml-0.5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
