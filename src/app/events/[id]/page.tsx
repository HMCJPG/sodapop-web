"use client";

import { getEventProvider } from "@/services/events";
import { ArrowLeft, MapPin, Calendar, Clock, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Event } from "@/types";
import { useUser } from "@/context/UserContext";

export default function EventDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, saveEvent, unsaveEvent } = useUser();

    useEffect(() => {
        async function fetchEvent() {
            if (!id) return;
            const provider = getEventProvider();
            const fetchedEvent = await provider.getEvent(id);
            setEvent(fetchedEvent);
            setLoading(false);
        }
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse text-rose-500">Loading details...</div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Event not found</h2>
                <Link href="/" className="text-rose-500 font-medium hover:underline">
                    Go back home
                </Link>
            </div>
        );
    }

    const isSaved = user.savedEventIds?.includes(event.id);

    const handleToggleSave = () => {
        if (isSaved) {
            unsaveEvent(event.id);
        } else {
            saveEvent(event.id);
        }
    };

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Hero Image */}
            <div className="relative h-80 w-full">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

                {/* Header Actions */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="relative -mt-10 bg-white rounded-t-3xl px-6 pt-8 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6 absolute top-3 left-1/2 -translate-x-1/2" />

                <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full uppercase tracking-wide">
                        {event.category || "Event"}
                    </span>
                    <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Posted recently</span>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {event.title}
                </h1>

                {/* Meta Info */}
                <div className="space-y-5 mb-8">
                    <div className="flex items-start p-4 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                            <Calendar className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Date & Time</p>
                            <p className="text-gray-600">{event.date} at {event.time}</p>
                        </div>
                    </div>

                    <div className="flex items-start p-4 bg-gray-50 rounded-2xl">
                        <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                            <MapPin className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-900">Location</p>
                            <p className="text-gray-900 font-medium">{event.location.name}</p>
                            <p className="text-gray-500 text-sm">{event.location.address}, {event.location.city}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="prose prose-rose max-w-none">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">About this event</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-lg">
                        {event.description}
                    </p>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 flex items-center gap-3 max-w-md mx-auto">
                <button
                    onClick={handleToggleSave}
                    className={`p-4 rounded-xl border-2 transition-all ${isSaved
                            ? "border-rose-500 bg-rose-50 text-rose-500"
                            : "border-gray-200 text-gray-400 hover:border-gray-300"
                        }`}
                >
                    <Heart className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
                </button>
                <button className="flex-1 bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-rose-600 active:scale-95 transition-all">
                    Get Tickets
                </button>
            </div>
        </div>
    );
}
