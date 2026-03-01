import { AppLayout } from '@/components/layout/app-layout'

export default function SettingsPage() {
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
                                    <input type="password" placeholder="sk-..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                                    <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors">Save</button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Anthropic API Key</label>
                                <div className="flex gap-2">
                                    <input type="password" placeholder="sk-ant-..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                                    <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors">Save</button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Google Gemini API Key</label>
                                <div className="flex gap-2">
                                    <input type="password" placeholder="AIza..." className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                                    <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 rounded-md font-medium text-sm transition-colors">Save</button>
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
                                <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                    <option value="gpt-4o">GPT-4o (OpenAI)</option>
                                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Anthropic)</option>
                                    <option value="gemini-1-5-pro">Gemini 1.5 Pro (Google)</option>
                                    <option value="grok-2">Grok 2 (xAI)</option>
                                </select>
                                <p className="text-xs text-muted-foreground">This model will be used as the primary orchestrator.</p>
                            </div>

                            <div className="flex items-center justify-between space-x-2">
                                <div className="flex flex-col space-y-1">
                                    <span className="text-sm font-medium leading-none">Auto-Approve Formatting Beats</span>
                                    <span className="text-sm text-muted-foreground">Allow agents to automatically fix typos in the Show Bible without approval.</span>
                                </div>
                                <button type="button" role="switch" aria-checked="false" className="peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input bg-input">
                                    <span data-state="unchecked" className="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0 translate-x-0"></span>
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

            </div>
        </AppLayout>
    )
}
