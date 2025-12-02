"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Event } from "@/types";

interface SavedEventsContextType {
    savedEvents: Event[];
    saveEvent: (event: Event) => void;
    removeEvent: (eventId: string) => void;
    isSaved: (eventId: string) => boolean;
}

const SavedEventsContext = createContext<SavedEventsContextType | undefined>(undefined);

export function SavedEventsProvider({ children }: { children: React.ReactNode }) {
    const [savedEvents, setSavedEvents] = useState<Event[]>([]);

    // Load from local storage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("savedEvents");
            if (stored) {
                try {
                    setSavedEvents(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse saved events", e);
                }
            }
        }
    }, []);

    // Save to local storage whenever it changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
        }
    }, [savedEvents]);

    const saveEvent = (event: Event) => {
        setSavedEvents((prev) => {
            if (prev.some((e) => e.id === event.id)) return prev;
            return [...prev, event];
        });
    };

    const removeEvent = (eventId: string) => {
        setSavedEvents((prev) => prev.filter((e) => e.id !== eventId));
    };

    const isSaved = (eventId: string) => {
        return savedEvents.some((e) => e.id === eventId);
    };

    return (
        <SavedEventsContext.Provider value={{ savedEvents, saveEvent, removeEvent, isSaved }}>
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
