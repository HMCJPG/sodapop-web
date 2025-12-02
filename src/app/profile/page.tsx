"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { getEventProvider } from "@/services/events";
import { Event } from "@/types";
import { MapPin, Calendar, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
    const { user, loading } = useUser();
    const [createdEvents, setCreatedEvents] = useState<Event[]>([]);

    useEffect(() => {
        async function loadCreatedEvents() {
            const provider = getEventProvider();
            // In a real app, we'd have a specific query for this.
            // For mock, we'll fetch all and filter.
            const allEvents = await provider.getNearbyEvents();
            const userEvents = allEvents.filter(e => user.createdEventIds.includes(e.id));
            setCreatedEvents(userEvents);
        }
        loadCreatedEvents();
    }, [user.createdEventIds]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400 animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 pb-24">
            <header className="p-4 flex justify-center items-center bg-white border-b border-gray-100 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            </header>

            <div className="p-6 flex flex-col items-center bg-white border-b border-gray-100">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-rose-100">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="w-10 h-10 text-gray-400" />
                        </div>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500 text-sm">Event Enthusiast</p>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">My Created Events</h3>

                {createdEvents.length === 0 ? (
                    <div className="text-center text-gray-500 py-8 bg-white rounded-xl border border-gray-100 border-dashed">
                        <p className="text-sm">You haven't created any events yet.</p>
                        <a href="/create" className="text-rose-500 font-medium text-sm mt-2 block hover:underline">Create your first event</a>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {createdEvents.map((event) => (
                            <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex border border-gray-100">
                                <div className="w-24 h-24 flex-shrink-0">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1">{event.title}</h3>
                                        <div className="flex items-center text-gray-500 text-xs mt-1">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            <span className="truncate">{event.location.name}, {event.location.city}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-xs mt-1">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            <span>{event.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
