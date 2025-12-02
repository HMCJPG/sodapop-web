import { getEventProvider } from "@/services/events";
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EventDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const provider = getEventProvider();
    const event = await provider.getEvent(id);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Hero Image */}
            <div className="relative h-72 w-full">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

                {/* Back Button */}
                <Link
                    href="/"
                    className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
            </div>

            {/* Content */}
            <div className="p-6 -mt-6 relative bg-white rounded-t-3xl">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />

                <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
                    {event.category || "Event"}
                </span>

                <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                    {event.title}
                </h1>

                {/* Meta Info */}
                <div className="space-y-4 mb-8">
                    <div className="flex items-start text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 mt-0.5 text-rose-500" />
                        <div>
                            <p className="font-semibold text-gray-900">Date</p>
                            <p className="text-sm">{event.date}</p>
                        </div>
                    </div>

                    <div className="flex items-start text-gray-600">
                        <Clock className="w-5 h-5 mr-3 mt-0.5 text-rose-500" />
                        <div>
                            <p className="font-semibold text-gray-900">Time</p>
                            <p className="text-sm">{event.time}</p>
                        </div>
                    </div>

                    <div className="flex items-start text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 mt-0.5 text-rose-500" />
                        <div>
                            <p className="font-semibold text-gray-900">Location</p>
                            <p className="text-sm font-medium">{event.location.name}</p>
                            <p className="text-sm text-gray-500">{event.location.address}, {event.location.city}</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="prose prose-rose max-w-none">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About this event</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {event.description}
                    </p>
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button className="w-full bg-rose-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-rose-600 active:scale-95 transition-all">
                    I'm Going
                </button>
            </div>
        </div>
    );
}
