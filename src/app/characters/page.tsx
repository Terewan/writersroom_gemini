import { AppLayout } from '@/components/layout/app-layout'

export default function CharactersPage() {
    return (
        <AppLayout>
            <div className="flex flex-1 flex-col p-8 max-w-4xl mx-auto w-full overflow-y-auto">
                <h1 className="text-3xl font-bold mb-4">Characters</h1>
                <p className="text-muted-foreground mb-8">
                    Manage your show's character bios, relationships, and color codes here. Currently, characters are fully managed within the Show Bible.
                </p>

                <div className="bg-card rounded-lg border p-12 text-center">
                    <h2 className="text-xl font-semibold mb-2">Character Database Coming Soon</h2>
                    <p className="text-sm text-muted-foreground">
                        This dedicated view will allow you to generate deep psychological profiles, character arcs across seasons, and map relationship webs.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                        For now, please use the <strong>Show Bible</strong> to define your core cast.
                    </p>
                </div>
            </div>
        </AppLayout>
    )
}
