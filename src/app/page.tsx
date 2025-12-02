"use client";

import { useEffect, useState } from "react";
import { CardDeck } from "@/components/CardDeck";
import { BottomNav } from "@/components/BottomNav";
import { getEventProvider } from "@/services/events";
import { Event } from "@/types";
import { Plus, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0); // Used to force re-fetch
  const { user, saveEvent, passEvent, loading: userLoading } = useUser();

  useEffect(() => {
    async function loadEvents() {
      if (userLoading) return;

      setLoading(true);
      const provider = getEventProvider();

      // Combine saved and passed IDs to exclude
      const excludeIds = [...(user.savedEventIds || []), ...(user.passedEventIds || [])];

      // If resetKey is odd (just an arbitrary way to toggle), we might want to ignore filters
      // But for "Start Over", we usually just want to re-fetch. 
      // The prompt says "Start Over" clears the exclusion list for the current session.
      // However, if we clear it, we might see things we've already saved.
      // Let's implement "Start Over" as fetching ALL events again (ignoring passed, but maybe keeping saved?)
      // For simplicity and MVP, "Start Over" will fetch everything, effectively resetting the "seen" filter for this view.

      const shouldFilter = resetKey === 0;
      const idsToExclude = shouldFilter ? excludeIds : [];

      const fetchedEvents = await provider.getNearbyEvents(idsToExclude);
      setEvents(fetchedEvents);
      setLoading(false);
    }
    loadEvents();
  }, [userLoading, user.savedEventIds, user.passedEventIds, resetKey]);

  const handleSwipeRight = (event: Event) => {
    saveEvent(event.id);
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const handleSwipeLeft = (event: Event) => {
    passEvent(event.id);
    setEvents((prev) => prev.filter((e) => e.id !== event.id));
  };

  const handleStartOver = () => {
    setResetKey(prev => prev + 1);
  };

  if (loading || userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-pulse text-rose-500 font-bold text-xl">SoDaPop...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 bg-white shadow-sm z-10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">SoDaPop</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
          <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative w-full max-w-md mx-auto flex flex-col justify-center items-center p-4">
        {events.length > 0 ? (
          <div className="w-full h-[600px] relative">
            <CardDeck
              events={events}
              onSwipeRight={handleSwipeRight}
              onSwipeLeft={handleSwipeLeft}
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-sm mx-auto">
            <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all caught up!</h2>
            <p className="text-gray-500 mb-8">
              We've run out of new events for now. Check back later or start over to see events again.
            </p>
            <button
              onClick={handleStartOver}
              className="w-full bg-rose-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-rose-600 active:scale-95 transition-all"
            >
              Start Over
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <Link href="/create" className="absolute bottom-24 right-6 z-50">
        <div className="w-14 h-14 bg-rose-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-rose-600 transition-colors">
          <Plus className="w-8 h-8" />
        </div>
      </Link>

      <BottomNav />
    </div>
  );
}
