import { Event } from "@/types";

export interface EventProvider {
    getNearbyEvents(excludeIds?: string[]): Promise<Event[]>;
    getEvent(id: string): Promise<Event | null>;
    createEvent(event: Omit<Event, 'id'>): Promise<Event>;
}
