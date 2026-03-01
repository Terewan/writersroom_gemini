import { AppLayout } from '@/components/layout/app-layout'

export default function BoardPage() {
    return (
        <AppLayout>
            <div className="flex flex-1 flex-col items-center justify-center p-8 h-full w-full">
                <h1 className="text-3xl font-bold">Beat Board</h1>
                <p className="text-muted-foreground mt-2">Drag and drop canvas coming soon.</p>
            </div>
        </AppLayout>
    )
}
