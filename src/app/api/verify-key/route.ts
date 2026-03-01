import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { provider, apiKey } = await req.json()

        if (!apiKey || typeof apiKey !== 'string') {
            return NextResponse.json({ valid: false, error: 'API key is required' }, { status: 400 })
        }

        // We run a tiny classification or generation task to verify the key works.
        // We use the smallest, cheapest models for this.
        let aiModel;

        try {
            switch (provider) {
                case 'openai':
                    const customOpenAI = createOpenAI({ apiKey })
                    aiModel = customOpenAI('gpt-4o-mini')
                    break;
                case 'anthropic':
                    const customAnthropic = createAnthropic({ apiKey })
                    // Haiku is their fastest/cheapest model
                    aiModel = customAnthropic('claude-3-haiku-20240307')
                    break;
                case 'gemini':
                    const customGoogle = createGoogleGenerativeAI({ apiKey })
                    aiModel = customGoogle('gemini-1.5-pro')
                    break;
                default:
                    return NextResponse.json({ valid: false, error: 'Unknown provider' }, { status: 400 })
            }

            // Attempt a tiny generation to prove the key is valid
            await generateText({
                model: aiModel,
                prompt: 'Say the word "test".',
                maxTokens: 5
            })

            return NextResponse.json({ valid: true })

        } catch (apiError: any) {
            console.error(`${provider} API Verification Error:`, apiError)

            // Format a friendly error message
            let errorMessage = 'Invalid API key or unauthorized.'
            if (apiError.message) {
                if (apiError.message.includes('401')) errorMessage = 'Invalid API key (401 Unauthorized).'
                else if (apiError.message.includes('403')) errorMessage = 'API key lacks permissions (403 Forbidden).'
                else if (apiError.message.includes('insufficient_quota')) errorMessage = 'API key is valid but out of credits.'
                else errorMessage = `Verification failed: ${apiError.message.split('\n')[0]}`
            }

            return NextResponse.json({ valid: false, error: errorMessage }, { status: 401 })
        }
    } catch (error) {
        console.error('Validation request error:', error)
        return NextResponse.json({ valid: false, error: 'Server error during validation' }, { status: 500 })
    }
}
