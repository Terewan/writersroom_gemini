import { AppLayout } from '@/components/layout/app-layout'
import { SplitPanel } from '@/components/layout/split-panel'
import { WritersRoomChat } from '@/components/chat/writers-room-chat'
import { ShowBible } from '@/components/documents/show-bible'

export default function RoomPage() {
    return (
        <AppLayout>
            <div className="flex flex-col h-full overflow-hidden w-full">
                <SplitPanel
                    leftPanel={<WritersRoomChat />}
                    rightPanel={<ShowBible />}
                    defaultLayout={[40, 60]} // Chat takes 40%, Beat Sheet takes 60%
                />
            </div>
        </AppLayout>
    )
}
