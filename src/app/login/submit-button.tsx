'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    pendingText?: string
}

export function SubmitButton({ children, pendingText, ...props }: SubmitButtonProps) {
    const { pending } = useFormStatus()

    return (
        <button {...props} type="submit" aria-disabled={pending}>
            {pending ? pendingText : children}
        </button>
    )
}
