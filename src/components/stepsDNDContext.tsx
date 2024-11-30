'use client'

import React, {useEffect, useState} from 'react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,} from '@dnd-kit/sortable';
import {restrictToParentElement, restrictToVerticalAxis,} from '@dnd-kit/modifiers';
import {StepsSortableItem} from './stepsSortableItem';
import {updateStepsOrderAction} from "@/actions/updateStepsOrderAction";
// import {TourSection, TourSectionToFile} from "@prisma/client";
//
// interface images extends TourSectionToFile {
//     file: File
// }
//
// interface Item extends TourSection {
//     images: images[]
// }

export function StepsDNDContext({sections, order, tourId, disabled}: {
    sections: any[],
    order: string[],
    tourId: string
    disabled: boolean
}) {
    const [items, setItems] = useState(order);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const {active, over} = event;

        if (active.id !== over?.id) {
            const oldIndex = items.indexOf(active?.id as string);
            const newIndex = items.indexOf(over?.id as string);
            setItems(arrayMove(items, oldIndex, newIndex));
        }
    }



    useEffect(() => {
        if (disabled) return
        const updateDB = setTimeout(() => {
            updateStepsOrderAction(tourId, items).then(() => null);
        }, 1000);
        return () => clearTimeout(updateDB);
    }, [disabled, items, tourId]);


    return (
        <DndContext
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            id={'sortable-context'}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}

            >
                {items.map((id, index: number) => <StepsSortableItem key={index} index={index} item={
                    sections.find(section => section.id === id)
                } disabled={disabled}/>)}
            </SortableContext>
        </DndContext>
    );


}