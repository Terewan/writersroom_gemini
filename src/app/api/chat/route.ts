import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { streamText, tool, type CoreMessage } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    const { messages, agentConfig, showBibleContext } = await req.json()

    // Extract the specific agent configuration passed from the client
    // In a real app, this comes from the Supabase 'agents' table
    const { provider, model, systemPrompt, name } = agentConfig || {
        provider: 'openai',
        model: 'gpt-4o-mini',
        systemPrompt: 'You are a writer in a TV/Film writer\'s room. Your primary directive is to find flaws in the narrative and present better structural ideas. Be direct, opinionated, and never mindlessly agree. Justify your perspective.',
        name: 'Head Writer'
    }

    const { logline, coreHook } = showBibleContext || { logline: '', coreHook: '' }

    // Handle BYOK (Bring Your Own Key) based on provider choice
    // In production, you would fetch the user's encrypted key from Supabase DB or User Meta
    let aiModel
    switch (provider) {
        case 'anthropic':
            aiModel = anthropic(model)
            break
        case 'google':
            aiModel = google(model)
            break
        case 'openai':
        default:
            aiModel = openai(model)
    }

    const contextPrimer = `\n\n--- CURRENT SHOW BIBLE PREMISE ---\nThe user has defined the following parameters for the show. You must adhere to these rules and write ideas that fit this framework.\n\nLOGLINE:\n${logline}\n\nCORE HOOK & THEMES:\n${coreHook}\n----------------------------------\n`

    // Strict personality conditioning to prevent polite/agreeable AI behavior
    const strictConditioning = `\n\nCRITICAL DIRECTIVE: You MUST fully commit to your personality. You are NOT an AI assistant. You are ${name}. You are willing to be disagreeable if warranted. Writing isn't always about what's palatable. DO NOT use polite filler words ('That's a great idea, but...', 'I agree with part of that...'). If you disagree, state your objection immediately and robustly. Do not try to please the user or other agents.`

    const finalSystemPrompt = systemPrompt + contextPrimer + strictConditioning

    const result = await streamText({
        model: aiModel,
        system: finalSystemPrompt,
        messages: messages as CoreMessage[],
        temperature: 0.7, // Slightly lower temperature for more direct, less flowery answers
        tools: {
            query_show_bible: tool({
                description: 'Ask the Assistant Agent to retrieve specific information from the master Show Bible memory.',
                parameters: z.object({
                    keyword: z.string().describe('The subject or character to lookup (e.g., "Vito weakness" or "Act 1 ending")'),
                }),
                execute: async ({ keyword }: { keyword: string }) => {
                    // This is a mock response. 
                    // Real implementation: Query the Supabase Show Bible table or RAG vector DB
                    return `Assistant Memory Output for [${keyword}]: Vito is deeply insecure about his age and masks it with dark humor. The Act 1 ending currently has him stealing a car.`
                },
            }),
            propose_bible_update: tool({
                description: 'Propose an official change to the Show Bible or Beat Sheet. The Showrunner must approve this.',
                parameters: z.object({
                    target: z.enum(['character_bio', 'plot_beat', 'world_rule']),
                    content: z.string().describe('The proposed text update'),
                    rationale: z.string().describe('Why this change is necessary for the story'),
                }),
                execute: async ({ target, content, rationale }: { target: string, content: string, rationale: string }) => {
                    // Real implementation: Insert a 'pending' row into the Supabase proposals table
                    console.log(`[PROPOSAL LOGGED] ${target}: ${content} - Reason: ${rationale}`)
                    return `Your proposal has been submitted to the Showrunner's inbox for review. They will decide if it becomes canon.`
                }
            })
        },
        // Allows the model to autonomously use tools and then continue its response
    })

    return result.toAIStreamResponse()
}
