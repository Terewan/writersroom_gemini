import { AppLayout } from '@/components/layout/app-layout'
import { SplitPanel } from '@/components/layout/split-panel'
import { WritersRoomChat } from '@/components/chat/writers-room-chat'

export default function RoomPage() {
    return (
        <AppLayout>
            <div className="flex flex-col h-full overflow-hidden w-full">
                <SplitPanel
                    leftPanel={<WritersRoomChat />}
                    rightPanel={
                        <div className="flex flex-col items-center justify-center h-full p-8 bg-muted/30">
                            <h2 className="text-2xl font-semibold mb-2">Show Bible & Beat Sheet</h2>
                            <p className="text-muted-foreground text-center">
                                The Master Document will appear here.<br />
                                Showrunner can review proposed updates from the AI agents.
                            </p>
                        </div>
                    }
                    defaultLayout={[40, 60]} // Chat takes 40%, Beat Sheet takes 60%
                />
            </div>
        </AppLayout>
    )
}
