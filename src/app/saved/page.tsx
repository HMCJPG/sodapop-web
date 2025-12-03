"use client";

import { useSavedEvents } from "@/context/SavedEventsContext";
import { Calendar, MapPin, Trash2 } from "lucide-react";
import Link from "next/link";

export default function SavedPage() {
    const { savedEvents, removeEvent } = useSavedEvents();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="p-4 flex justify-center items-center bg-white border-b border-gray-100 sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-900">Saved Events</h1>
            </header>

            <div className="p-4 space-y-4 pb-24">
                {savedEvents.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <p className="text-lg font-medium">No saved events yet.</p>
                        <p className="text-sm mt-2">Swipe right on events to save them!</p>
                    </div>
                ) : (
                    savedEvents.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl shadow-sm overflow-hidden flex border border-gray-100 relative group">
                            <Link href={`/events/${event.id}`} className="flex-1 flex">
                                <div className="w-24 h-24 flex-shrink-0">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-rose-500 transition-colors">{event.title}</h3>
                                        <div className="flex items-center text-gray-500 text-xs mt-1">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            <span className="truncate">{event.location.name}, {event.location.city}</span>
                                        </div>
                                        <div className="flex items-center text-gray-500 text-xs mt-1">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            <span>{event.date} • {event.time}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeEvent(event.id);
                                }}
                                className="absolute bottom-3 right-3 text-red-500 text-xs flex items-center hover:text-red-700 font-medium z-10 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full"
                            >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
