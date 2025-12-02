import { Event } from "@/types";
import { EventProvider } from "./EventProvider";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";

const MOCK_EVENTS: Event[] = [
    {
        id: "1",
        title: "Saturday Morning Storytime",
        date: "2023-10-28",
        time: "10:00 AM",
        location: {
            name: "City Library",
            address: "123 Library Ln",
            city: "Metropolis"
        },
        imageUrl: "https://images.unsplash.com/photo-1519331379826-f9478558d136?w=800&q=80",
        description: "Join us for a magical journey through stories! Perfect for kids aged 3-8.",
        category: "Social",
    },
    {
        id: "2",
        title: "Main St. Night Market",
        date: "2023-10-28",
        time: "6:00 PM",
        location: {
            name: "Downtown Plaza",
            address: "456 Main St",
            city: "Metropolis"
        },
        imageUrl: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=800&q=80",
        description: "Experience local food, crafts, and live music under the stars.",
        category: "Food",
    },
    {
        id: "3",
        title: "Beginner Pottery Workshop",
        date: "2023-10-29",
        time: "2:00 PM",
        location: {
            name: "Local Art Studio",
            address: "789 Art Ave",
            city: "Metropolis"
        },
        imageUrl: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80",
        description: "Learn the basics of wheel throwing and hand-building. All materials provided.",
        category: "Workshop",
    },
    {
        id: "4",
        title: "Community Yoga in the Park",
        date: "2023-10-29",
        time: "9:00 AM",
        location: {
            name: "Central Park",
            address: "101 Park Blvd",
            city: "Metropolis"
        },
        imageUrl: "https://images.unsplash.com/photo-1544367563-12123d8965cd?w=800&q=80",
        description: "Relax and rejuvenate with a free community yoga session. Bring your own mat!",
        category: "Health",
    },
    {
        id: "5",
        title: "Tech Meetup: AI & Future",
        date: "2023-10-30",
        time: "7:00 PM",
        location: {
            name: "Innovation Hub",
            address: "202 Tech Way",
            city: "Metropolis"
        },
        imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
        description: "Discuss the latest trends in Artificial Intelligence with industry experts.",
        category: "Tech",
    },
];

export class MockEventProvider implements EventProvider {
    async getNearbyEvents(excludeIds?: string[]): Promise<Event[]> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        let events = MOCK_EVENTS;

        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("sodapop_events");
            if (stored) {
                try {
                    const storedEvents = JSON.parse(stored) as Event[];
                    events = storedEvents.map(e => ({
                        ...e,
                        imageUrl: e.imageUrl || DEFAULT_IMAGE
                    }));
                } catch (e) {
                    console.error("Failed to parse stored events", e);
                }
            } else {
                // Initialize storage with mock data if empty
                localStorage.setItem("sodapop_events", JSON.stringify(MOCK_EVENTS));
            }
        }

        if (excludeIds && excludeIds.length > 0) {
            events = events.filter(e => !excludeIds.includes(e.id));
        }

        return events;
    }

    async getEvent(id: string): Promise<Event | null> {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const events = await this.getNearbyEvents();
        return events.find((e) => e.id === id) || null;
    }

    async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newEvent = {
            ...event,
            id: Math.random().toString(36).substr(2, 9),
            imageUrl: event.imageUrl || DEFAULT_IMAGE
        };

        if (typeof window !== "undefined") {
            const events = await this.getNearbyEvents();
            const updatedEvents = [newEvent, ...events];
            localStorage.setItem("sodapop_events", JSON.stringify(updatedEvents));
        }

        return newEvent;
    }
}
