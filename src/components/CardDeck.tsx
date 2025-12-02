"use client";

import { Event } from "@/types";
import { Card } from "./Card";

interface CardDeckProps {
    events: Event[];
    onSwipeRight: (event: Event) => void;
    onSwipeLeft: (event: Event) => void;
}

export function CardDeck({ events, onSwipeRight, onSwipeLeft }: CardDeckProps) {
    if (events.length === 0) {
        return null; // Empty state is handled by parent
    }

    return (
        <div className="relative w-full max-w-md h-[600px] mx-auto">
            {events.map((event, index) => (
                <Card
                    key={event.id}
                    event={event}
                    active={index === 0}
                    onSwipeRight={() => onSwipeRight(event)}
                    onSwipeLeft={() => onSwipeLeft(event)}
                />
            )).reverse()}
        </div>
    );
}
