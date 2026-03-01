'use client'

import { useState, useEffect } from 'react'
import { AppLayout } from '@/components/layout/app-layout'
import { SplitPanel } from '@/components/layout/split-panel'
import { WritersRoomChat } from '@/components/chat/writers-room-chat'
import { ShowBible } from '@/components/documents/show-bible'

const DEFAULT_LOGLINE = "In a world where memories can be extracted and sold on the black market, a down-on-his-luck memory broker discovers a conspiracy buried in the mind of his latest high-profile client."
const DEFAULT_HOOK = "The show explores the nature of identity and truth. If someone else's memory feels real to you, does it become your truth? The visual style relies heavily on neon-noir aesthetics mixed with grounded, gritty analog technology required to extract the memories."

export default function RoomPage() {
    // In a real app with Supabase, these would initialize from DB
    const [logline, setLoglineState] = useState(DEFAULT_LOGLINE)
    const [coreHook, setCoreHookState] = useState(DEFAULT_HOOK)

    // Load from local storage on mount
    useEffect(() => {
        const storedLogline = localStorage.getItem('WRITERS_ROOM_LOGLINE')
        const storedHook = localStorage.getItem('WRITERS_ROOM_HOOK')
        if (storedLogline) setLoglineState(storedLogline)
        if (storedHook) setCoreHookState(storedHook)
    }, [])

    const setLogline = (newVal: string) => {
        setLoglineState(newVal)
        localStorage.setItem('WRITERS_ROOM_LOGLINE', newVal)
    }

    const setCoreHook = (newVal: string) => {
        setCoreHookState(newVal)
        localStorage.setItem('WRITERS_ROOM_HOOK', newVal)
    }

    return (
        <AppLayout>
            <div className="flex flex-col h-full overflow-hidden w-full">
                <SplitPanel
                    leftPanel={<WritersRoomChat currentLogline={logline} currentHook={coreHook} />}
                    rightPanel={<ShowBible logline={logline} coreHook={coreHook} onLoglineChange={setLogline} onHookChange={setCoreHook} />}
                    defaultLayout={[40, 60]} // Chat takes 40%, Beat Sheet takes 60%
                />
            </div>
        </AppLayout>
    )
}
