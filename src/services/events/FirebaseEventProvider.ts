import { Event } from "@/types";
import { EventProvider } from "./EventProvider";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    doc,
    getDoc,
    Timestamp,
    serverTimestamp
} from "firebase/firestore";

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000";

export class FirebaseEventProvider implements EventProvider {
    private eventsCollection = collection(db, "events");

    async getNearbyEvents(excludeIds?: string[]): Promise<Event[]> {
        try {
            const snapshot = await getDocs(this.eventsCollection);
            let events = snapshot.docs.map((doc) => {
                const data = doc.data();

                // Convert Firestore Timestamps to strings
                let date = data.date;
                if (data.date instanceof Timestamp) {
                    date = data.date.toDate().toISOString().split('T')[0];
                }

                return {
                    id: doc.id,
                    title: data.title || "",
                    description: data.description || "",
                    date: date || "",
                    time: data.time || "",
                    location: data.location || { name: "Unknown", address: "", city: "" },
                    imageUrl: data.imageUrl || DEFAULT_IMAGE,
                    category: data.category || "Social",
                } as Event;
            });

            if (excludeIds && excludeIds.length > 0) {
                events = events.filter(e => !excludeIds.includes(e.id));
            }

            return events;
        } catch (error) {
            console.error("Error fetching events from Firebase:", error);
            return [];
        }
    }

    async getEvent(id: string): Promise<Event | null> {
        try {
            const docRef = doc(db, "events", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                return null;
            }

            const data = docSnap.data();

            // Convert Firestore Timestamps to strings
            let date = data.date;
            if (data.date instanceof Timestamp) {
                date = data.date.toDate().toISOString().split('T')[0];
            }

            return {
                id: docSnap.id,
                title: data.title || "",
                description: data.description || "",
                date: date || "",
                time: data.time || "",
                location: data.location || { name: "Unknown", address: "", city: "" },
                imageUrl: data.imageUrl || DEFAULT_IMAGE,
                category: data.category || "Social",
            } as Event;
        } catch (error) {
            console.error("Error fetching event details from Firebase:", error);
            return null;
        }
    }

    async createEvent(event: Omit<Event, 'id'>): Promise<Event> {
        try {
            const docRef = await addDoc(this.eventsCollection, {
                ...event,
                imageUrl: event.imageUrl || DEFAULT_IMAGE,
                createdAt: serverTimestamp(),
            });

            return {
                id: docRef.id,
                ...event,
                imageUrl: event.imageUrl || DEFAULT_IMAGE,
            };
        } catch (error) {
            console.error("Error creating event in Firebase:", error);
            throw new Error("Failed to create event");
        }
    }
}
