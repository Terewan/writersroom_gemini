'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'

export default function SettingsPage() {
    const [openAIKey, setOpenAIKey] = useState('')
    const [anthropicKey, setAnthropicKey] = useState('')
    const [geminiKey, setGeminiKey] = useState('')
    const [defaultModel, setDefaultModel] = useState('gpt-4o-mini')
    const [autoApprove, setAutoApprove] = useState(false)

    // Track save status for UI feedback
    const [savedStatus, setSavedStatus] = useState({
        openai: false,
        anthropic: false,
        gemini: false,
        model: false,
        autoApprove: false
    })

    // Load keys from localStorage on mount
    useEffect(() => {
        const storedOpenAI = localStorage.getItem('WRITERS_ROOM_OPENAI_KEY')
        const storedAnthropic = localStorage.getItem('WRITERS_ROOM_ANTHROPIC_KEY')
        const storedGemini = localStorage.getItem('WRITERS_ROOM_GEMINI_KEY')
        const storedModel = localStorage.getItem('WRITERS_ROOM_DEFAULT_MODEL')
        const storedAutoApprove = localStorage.getItem('WRITERS_ROOM_AUTO_APPROVE')

        if (storedOpenAI) setOpenAIKey(storedOpenAI)
        if (storedAnthropic) setAnthropicKey(storedAnthropic)
        if (storedGemini) setGeminiKey(storedGemini)
        if (storedModel) setDefaultModel(storedModel)
        if (storedAutoApprove) setAutoApprove(storedAutoApprove === 'true')
    }, [])

    const handleToggleAutoApprove = () => {
        const newValue = !autoApprove
        setAutoApprove(newValue)
        localStorage.setItem('WRITERS_ROOM_AUTO_APPROVE', newValue.toString())
    }

    const handleSaveModel = (value: string) => {
        setDefaultModel(value)
        localStorage.setItem('WRITERS_ROOM_DEFAULT_MODEL', value)
        setSavedStatus(prev => ({ ...prev, model: true }))
        setTimeout(() => setSavedStatus(prev => ({ ...prev, model: false })), 2000)
    }

    const handleSave = (provider: 'openai' | 'anthropic' | 'gemini', value: string) => {
        let keyName = ''
        switch (provider) {
            case 'openai': keyName = 'WRITERS_ROOM_OPENAI_KEY'; break;
            case 'anthropic': keyName = 'WRITERS_ROOM_ANTHROPIC_KEY'; break;
            case 'gemini': keyName = 'WRITERS_ROOM_GEMINI_KEY'; break;
        }

        if (value.trim() === '') {
            localStorage.removeItem(keyName)
        } else {
            localStorage.setItem(keyName, value.trim())
        }

        // Show saved feedback
        setSavedStatus(prev => ({ ...prev, [provider]: true }))
        setTimeout(() => {
            setSavedStatus(prev => ({ ...prev, [provider]: false }))
        }, 2000)
    }

    return (
        <AppLayout>
            <div className="flex flex-1 flex-col p-8 max-w-4xl mx-auto w-full overflow-y-auto">
                <h1 className="text-3xl font-bold mb-8">Settings</h1>

                <div className="space-y-10">
                    {/* Provider Settings */}
                    <section className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">AI Providers & API Keys</h2>
                            <p className="text-sm text-muted-foreground">
                                Enter your API keys to enable the AI agents. Keys are stored locally and never sent to our servers.
                            </p>
                        </div>

                        <div className="bg-card rounded-lg border p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">OpenAI API Key</label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="sk-..."
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={openAIKey}
                                        onChange={(e) => setOpenAIKey(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleSave('openai', openAIKey)}
                                        className={`h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors ${savedStatus.openai ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                                    >
                                        {savedStatus.openai ? 'Saved!' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Anthropic API Key</label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="sk-ant-..."
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={anthropicKey}
                                        onChange={(e) => setAnthropicKey(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleSave('anthropic', anthropicKey)}
                                        className={`h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors ${savedStatus.anthropic ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                                    >
                                        {savedStatus.anthropic ? 'Saved!' : 'Save'}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Google Gemini API Key</label>
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        placeholder="AIza..."
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={geminiKey}
                                        onChange={(e) => setGeminiKey(e.target.value)}
                                    />
                                    <button
                                        onClick={() => handleSave('gemini', geminiKey)}
                                        className={`h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors ${savedStatus.gemini ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                                    >
                                        {savedStatus.gemini ? 'Saved!' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Project Settings */}
                    <section className="space-y-4">
                        <div>
                            <h2 className="text-xl font-semibold">Project Defaults</h2>
                            <p className="text-sm text-muted-foreground">
                                Set the default behavior for new projects and the writer's room.
                            </p>
                        </div>

                        <div className="bg-card rounded-lg border p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Default Model Selection</label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={defaultModel}
                                    onChange={(e) => handleSaveModel(e.target.value)}
                                >
                                    <option value="gpt-4o-mini">GPT-4o Mini (OpenAI)</option>
                                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                                    <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet (Anthropic)</option>
                                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Google)</option>
                                </select>
                                <p className="text-xs text-muted-foreground">This model will be used as the primary orchestrator.</p>
                                {savedStatus.model && (
                                    <span className="text-sm text-green-500 font-medium">✅ Default Model Saved!</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <span className="text-sm font-medium leading-none">Auto-Approve Formatting Beats</span>
                                    <span className="text-sm text-muted-foreground">Allow agents to automatically fix typos in the Show Bible without approval.</span>
                                </div>
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={autoApprove}
                                    onClick={handleToggleAutoApprove}
                                    className={`peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${autoApprove ? 'bg-primary' : 'bg-input'}`}
                                >
                                    <span
                                        data-state={autoApprove ? 'checked' : 'unchecked'}
                                        className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${autoApprove ? 'translate-x-5' : 'translate-x-0'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </AppLayout>
    )
}
