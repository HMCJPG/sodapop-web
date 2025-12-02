import { Event } from "@/types";
import { EventProvider } from "./EventProvider";

export class ScraperEventProvider implements EventProvider {
    async getNearbyEvents(excludeIds?: string[]): Promise<Event[]> {
        console.warn("ScraperEventProvider is not yet implemented. Returning empty list.");
        return [];
    }

    async getEvent(id: string): Promise<Event | null> {
        console.warn("ScraperEventProvider is not yet implemented.");
        return null;
    }

    async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
        throw new Error("Method not implemented.");
    }
}
