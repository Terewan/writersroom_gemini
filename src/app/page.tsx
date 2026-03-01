import { AppLayout } from '@/components/layout/app-layout'
import Link from 'next/link'

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-muted/10 h-full w-full">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to the Room.
          </h1>
          <p className="text-xl text-muted-foreground">
            Sign in to load your projects, or jump right in as a guest to build a quick story.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/room"
              className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors h-11 px-8"
            >
              Enter as Guest
            </Link>
            <button
              disabled
              className="bg-secondary text-secondary-foreground opacity-50 cursor-not-allowed inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-11 px-8"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
