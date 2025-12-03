"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Event } from "@/types";
import { useUser } from "./UserContext";
import { getEventProvider } from "@/services/events";

interface SavedEventsContextType {
    savedEvents: Event[];
    saveEvent: (event: Event) => void;
    removeEvent: (eventId: string) => void;
    isSaved: (eventId: string) => boolean;
    loading: boolean;
}

const SavedEventsContext = createContext<SavedEventsContextType | undefined>(undefined);

export function SavedEventsProvider({ children }: { children: React.ReactNode }) {
    const { user, saveEvent: userSaveEvent, unsaveEvent: userUnsaveEvent } = useUser();
    const [savedEvents, setSavedEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Sync savedEvents with user.savedEventIds
    useEffect(() => {
        async function fetchSavedEvents() {
            if (!user.savedEventIds || user.savedEventIds.length === 0) {
                setSavedEvents([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            const provider = getEventProvider();
            const events: Event[] = [];

            // Fetch each event by ID
            // Optimization: In a real app, we'd want a bulk fetch method (getEventsByIds)
            for (const id of user.savedEventIds) {
                try {
                    const event = await provider.getEvent(id);
                    if (event) {
                        events.push(event);
                    }
                } catch (error) {
                    console.error(`Failed to fetch event ${id}`, error);
                }
            }

            setSavedEvents(events);
            setLoading(false);
        }

        fetchSavedEvents();
    }, [user.savedEventIds]);

    const saveEvent = (event: Event) => {
        // Optimistic update (optional, but good for UI responsiveness)
        // For now, we rely on the useEffect to sync back from UserContext
        userSaveEvent(event.id);
    };

    const removeEvent = (eventId: string) => {
        userUnsaveEvent(eventId);
    };

    const isSaved = (eventId: string) => {
        return user.savedEventIds?.includes(eventId) || false;
    };

    return (
        <SavedEventsContext.Provider value={{ savedEvents, saveEvent, removeEvent, isSaved, loading }}>
            {children}
        </SavedEventsContext.Provider>
    );
}

export function useSavedEvents() {
    const context = useContext(SavedEventsContext);
    if (context === undefined) {
        throw new Error("useSavedEvents must be used within a SavedEventsProvider");
    }
    return context;
}
