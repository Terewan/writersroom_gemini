import Link from 'next/link'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { SubmitButton } from './submit-button'

export default async function Login({
    searchParams,
}: {
    searchParams: Promise<{ message: string }>
}) {
    const params = await searchParams

    const signIn = async (formData: FormData) => {
        'use server'

        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return redirect('/login?message=Could not authenticate user')
        }

        return redirect('/room')
    }

    const signUp = async (formData: FormData) => {
        'use server'

        const origin = (await headers()).get('origin')
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const supabase = await createClient()

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        })

        if (error) {
            return redirect('/login?message=Could not authenticate user')
        }

        return redirect('/login?message=Check email to continue sign in process')
    }

    return (
        <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 m-auto min-h-screen items-center">
            <Link
                href="/"
                className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
                >
                    <polyline points="15 18 9 12 15 6" />
                </svg>{' '}
                Back
            </Link>

            <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-4 text-center">
                    Sign In
                </h1>
                <label className="text-md font-semibold text-muted-foreground" htmlFor="email">
                    Email
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-4 focus:ring-2 focus:ring-primary focus:outline-none"
                    name="email"
                    placeholder="you@example.com"
                    required
                />
                <label className="text-md font-semibold text-muted-foreground" htmlFor="password">
                    Password
                </label>
                <input
                    className="rounded-md px-4 py-2 bg-inherit border mb-6 focus:ring-2 focus:ring-primary focus:outline-none"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    required
                />
                <SubmitButton
                    formAction={signIn}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-4 py-2 mb-2 transition-colors inline-flex items-center justify-center text-sm"
                    pendingText="Signing In..."
                >
                    Sign In
                </SubmitButton>
                <SubmitButton
                    formAction={signUp}
                    className="border border-foreground/20 hover:bg-muted font-medium rounded-md px-4 py-2 mb-2 transition-colors inline-flex items-center justify-center text-sm"
                    pendingText="Signing Up..."
                >
                    Sign Up
                </SubmitButton>
                {params?.message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center rounded-md">
                        {params.message}
                    </p>
                )}
            </form>
        </div>
    )
}
