"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types";
import { Card } from "@/components/Card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import ImageSelector from "@/components/ImageSelector";
import { DEFAULT_EVENT_IMAGES } from "@/lib/defaultEventImages";

export default function CreateEventPage() {
    const router = useRouter();
    const { trackCreatedEvent, loading: userLoading } = useUser();
    const [loading, setLoading] = useState(false);

    // Separate state for location fields
    const [locationName, setLocationName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");

    const [formData, setFormData] = useState<Omit<Event, "id" | "location">>({
        title: "",
        description: "",
        date: "",
        time: "",
        category: "Social",
        imageUrl: DEFAULT_EVENT_IMAGES[0],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { getEventProvider } = await import("@/services/events");
            const provider = getEventProvider();

            const fullEvent = {
                ...formData,
                location: {
                    name: locationName,
                    address,
                    city
                }
            };

            const newEvent = await provider.createEvent(fullEvent);

            // Track the created event in UserContext
            trackCreatedEvent(newEvent.id);

            router.push("/");
        } catch (error) {
            console.error("Failed to create event", error);
        } finally {
            setLoading(false);
        }
    };

    // Dummy event for preview
    const previewEvent: Event = {
        id: "preview",
        ...formData,
        location: {
            name: locationName || "Venue Name",
            address: address || "123 Street",
            city: city || "City"
        },
        // Use default image if empty, matching Provider logic for preview consistency
        imageUrl: formData.imageUrl || DEFAULT_EVENT_IMAGES[0],
    };

    if (userLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-400 animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
            <header className="p-4 bg-white border-b border-gray-100 sticky top-0 z-20 flex items-center">
                <Link href="/" className="mr-4 text-gray-600">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-xl font-bold text-gray-900">Create Event</h1>
            </header>

            <main className="flex-1 p-4 space-y-8">

                {/* Preview Section */}
                <div className="flex flex-col items-center">
                    <h2 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Preview</h2>
                    <div className="relative w-full max-w-xs h-[400px] pointer-events-none">
                        <Card
                            event={previewEvent}
                            active={true}
                            onSwipeRight={() => { }}
                            onSwipeLeft={() => { }}
                        />
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Saturday Night Jazz"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            required
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="What's the vibe?"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                name="date"
                                required
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input
                                type="time"
                                name="time"
                                required
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Location Fields */}
                    <div className="space-y-4 border-t border-gray-100 pt-4">
                        <h3 className="text-sm font-semibold text-gray-900">Location Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Venue Name</label>
                            <input
                                type="text"
                                value={locationName}
                                onChange={(e) => setLocationName(e.target.value)}
                                required
                                placeholder="e.g. Central Park"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                placeholder="e.g. 123 Park Lane"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                placeholder="e.g. New York"
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                        >
                            <option value="Social">Social</option>
                            <option value="Food">Food</option>
                            <option value="Music">Music</option>
                            <option value="Workshop">Workshop</option>
                            <option value="Health">Health</option>
                            <option value="Tech">Tech</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Choose an Image</label>
                        <ImageSelector
                            selectedImage={formData.imageUrl}
                            onSelect={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-rose-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? "Creating..." : "Create Event"}
                    </button>
                </form>
            </main>
        </div>
    );
}
