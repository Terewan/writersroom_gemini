'use client'

import React from 'react'
import { Panel, Group, Separator } from 'react-resizable-panels'
import { cn } from '@/lib/utils'

interface SplitPanelProps {
    leftPanel: React.ReactNode
    rightPanel: React.ReactNode
    defaultLayout?: [number, number]
    className?: string
}

export function SplitPanel({
    leftPanel,
    rightPanel,
    defaultLayout = [50, 50],
    className,
}: SplitPanelProps) {
    return (
        <Group
            orientation="horizontal"
            className={cn('h-full w-full', className)}
        >
            <Panel defaultSize={defaultLayout[0]} minSize={30}>
                <div className="h-full w-full overflow-hidden">
                    {leftPanel}
                </div>
            </Panel>
            <Separator className="w-2 bg-muted hover:bg-primary/50 transition-colors flex items-center justify-center group cursor-col-resize">
                <div className="w-1 h-8 rounded-full bg-border group-hover:bg-primary transition-colors" />
            </Separator>
            <Panel defaultSize={defaultLayout[1]} minSize={30}>
                <div className="h-full w-full overflow-hidden bg-muted/20">
                    {rightPanel}
                </div>
            </Panel>
        </Group>
    )
}
