'use client'

import React, { useState } from 'react'
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DragOverlay,
} from '@dnd-kit/core'
import {
    SortableContext,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'

// Types
export type BeatType = 'plot' | 'emotion'

export interface BeatCard {
    id: string
    actId: string
    title: string
    content: string
    type: BeatType
    colorHex: string
}

export interface ActColumn {
    id: string
    title: string
}

// Initial Mock Data
const INITIAL_COLUMNS: ActColumn[] = [
    { id: 'act-1', title: 'Act 1' },
    { id: 'midpoint', title: 'Midpoint' },
    { id: 'act-2', title: 'Act 2' },
    { id: 'act-3', title: 'Act 3' },
]

const INITIAL_CARDS: BeatCard[] = [
    { id: 'c1', actId: 'act-1', title: 'Inciting Incident', content: 'Hero discovers the ancient map.', type: 'plot', colorHex: '#3b82f6' },
    { id: 'c2', actId: 'act-1', title: 'Refusal', content: 'Hero is afraid to leave home.', type: 'emotion', colorHex: '#ef4444' },
    { id: 'c3', actId: 'midpoint', title: 'Point of No Return', content: 'The bridge collapses, trapping them in the valley.', type: 'plot', colorHex: '#10b981' },
    { id: 'c4', actId: 'act-3', title: 'Climax', content: 'Hero confronts the villain.', type: 'plot', colorHex: '#f59e0b' },
]

// --- Sortable Item Component --- //
interface SortableBeatCardProps {
    card: BeatCard
}

function SortableBeatCard({ card }: SortableBeatCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id, data: { type: 'Card', card } })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "p-4 mb-3 rounded-lg border bg-card shadow-sm cursor-grab select-none hover:border-primary/50 transition-colors",
                isDragging && "opacity-50 border-primary"
            )}
        >
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: card.colorHex }}
                />
                <h4 className="text-sm font-semibold truncate text-foreground">{card.title}</h4>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3">{card.content}</p>
            <div className="mt-3 flex gap-2">
                <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider",
                    card.type === 'plot' ? 'bg-primary/10 text-primary' : 'bg-purple-500/10 text-purple-500'
                )}>
                    {card.type}
                </span>
            </div>
        </div>
    )
}

// --- Main Beat Board Component --- //
export function BeatBoard() {
    const [columns] = useState<ActColumn[]>(INITIAL_COLUMNS)
    const [cards, setCards] = useState<BeatCard[]>(INITIAL_CARDS)
    const [activeCard, setActiveCard] = useState<BeatCard | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // minimum drag distance before activating
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        const draggedCard = cards.find(c => c.id === active.id)
        if (draggedCard) setActiveCard(draggedCard)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const activeCardData = active.data.current?.card as BeatCard | undefined
        const overType = over.data.current?.type

        if (!activeCardData) return

        // If dragging over another card
        if (overType === 'Card') {
            const overCardData = over.data.current?.card as BeatCard
            if (activeCardData.actId !== overCardData.actId) {
                setCards((prev) => {
                    const activeIndex = prev.findIndex(c => c.id === activeId)
                    const overIndex = prev.findIndex(c => c.id === overId)
                    const newArray = [...prev]
                    newArray[activeIndex] = { ...newArray[activeIndex], actId: overCardData.actId }
                    return arrayMove(newArray, activeIndex, overIndex)
                })
            }
        }

        // If dragging over an empty column area
        if (overType === 'Column') {
            if (activeCardData.actId !== overId) {
                setCards((prev) => {
                    const activeIndex = prev.findIndex(c => c.id === activeId)
                    const newArray = [...prev]
                    newArray[activeIndex] = { ...newArray[activeIndex], actId: String(overId) }
                    return arrayMove(newArray, activeIndex, newArray.length - 1)
                })
            }
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveCard(null)
        const { active, over } = event
        if (!over) return

        const activeId = active.id
        const overId = over.id
        if (activeId === overId) return

        setCards(prev => {
            const activeIndex = prev.findIndex(c => c.id === activeId)
            const overIndex = prev.findIndex(c => c.id === overId)
            if (activeIndex !== -1 && overIndex !== -1) {
                return arrayMove(prev, activeIndex, overIndex)
            }
            return prev
        })
    }

    const handleAddBeat = () => {
        const newCard: BeatCard = {
            id: `new-card-${Date.now()}`,
            actId: columns[0].id,
            title: 'New Beat',
            content: 'Describe what happens here...',
            type: 'plot',
            colorHex: '#8b5cf6' // Default purple
        }
        setCards(prev => [newCard, ...prev])
    }

    return (
        <div className="h-full w-full flex flex-col pt-4 overflow-hidden">
            <div className="flex px-6 mb-4 items-center justify-between">
                <h2 className="text-xl font-bold">Show Beat Sheet</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleAddBeat}
                        className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded hover:bg-primary/20 transition-colors"
                    >
                        + Add Beat
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 pb-6 no-scrollbar">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex h-full gap-6 items-start">
                        {columns.map(column => (
                            <div key={column.id} className="flex flex-col flex-shrink-0 w-80 h-full max-h-full">
                                <div className="bg-muted/50 p-3 rounded-t-xl border-t border-x border-b-2 border-b-primary/20 sticky top-0 z-10">
                                    <h3 className="font-semibold text-foreground/80 flex justify-between items-center">
                                        {column.title}
                                        <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-0.5 rounded-full border">
                                            {cards.filter(c => c.actId === column.id).length}
                                        </span>
                                    </h3>
                                </div>

                                <div
                                    className="flex-1 overflow-y-auto no-scrollbar bg-muted/20 border-x border-b rounded-b-xl p-3"
                                >
                                    {/* useSortable for the column itself to accept drops when empty */}
                                    <ColumnDropZone columnId={column.id} />

                                    <SortableContext
                                        items={cards.filter(c => c.actId === column.id).map(c => c.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="min-h-[100px] h-full">
                                            {cards
                                                .filter(c => c.actId === column.id)
                                                .map(card => (
                                                    <SortableBeatCard key={card.id} card={card} />
                                                ))}
                                        </div>
                                    </SortableContext>
                                </div>
                            </div>
                        ))}
                    </div>

                    <DragOverlay>
                        {activeCard ? (
                            <div className="p-4 rounded-lg border-2 border-primary bg-card shadow-xl opacity-90 rotate-2">
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: activeCard.colorHex }}
                                    />
                                    <h4 className="text-sm font-semibold truncate text-foreground">{activeCard.title}</h4>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-3">{activeCard.content}</p>
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    )
}

// Helper to make empty columns droppable
function ColumnDropZone({ columnId }: { columnId: string }) {
    const { setNodeRef } = useSortable({
        id: columnId,
        data: { type: 'Column' }
    })

    return <div ref={setNodeRef} className="absolute inset-0 z-0 pointer-events-none" />
}
