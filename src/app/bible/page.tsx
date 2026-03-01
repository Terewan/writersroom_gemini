import { AppLayout } from '@/components/layout/app-layout'
import { ShowBible } from '@/components/documents/show-bible'

export default function BiblePage() {
    return (
        <AppLayout>
            <div className="flex flex-1 h-full w-full overflow-y-auto w-full max-w-5xl mx-auto">
                {/* For the standalone page, we pass empty default props or load from context */}
                <ShowBible />
            </div>
        </AppLayout>
    )
}
