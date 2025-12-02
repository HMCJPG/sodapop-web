"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { Event } from "@/types";
import { MapPin, Calendar, Clock } from "lucide-react";
import { AnalyticsService, AnalyticsActions } from "@/services/analytics/AnalyticsService";
import Link from "next/link";

interface CardProps {
    event: Event;
    onSwipeRight: () => void;
    onSwipeLeft: () => void;
    active: boolean;
}

export function Card({ event, onSwipeRight, onSwipeLeft, active }: CardProps) {
    const x = useMotionValue(0);
    const controls = useAnimation();
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Visual feedback opacity
    const likeOpacity = useTransform(x, [20, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

    const handleDragEnd = async (e: any, info: any) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset > 100 || velocity > 500) {
            await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
            AnalyticsService.trackAction(AnalyticsActions.SWIPE_RIGHT, event.id, { title: event.title });
            onSwipeRight();
        } else if (offset < -100 || velocity < -500) {
            await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
            AnalyticsService.trackAction(AnalyticsActions.SWIPE_LEFT, event.id, { title: event.title });
            onSwipeLeft();
        } else {
            controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    if (!active) {
        return (
            <div
                className="absolute top-0 left-0 w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 transform scale-95 opacity-50"
                style={{ zIndex: 0 }}
            >
                <div className="h-[75%] w-full relative">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                </div>
                <div className="h-[25%] p-5 flex flex-col justify-between bg-white">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 line-clamp-1">{event.title}</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x, rotate, opacity, zIndex: 10 }}
            className="absolute top-0 left-0 w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing border border-gray-200"
        >
            {/* Image */}
            <div className="h-[75%] w-full relative">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

                {/* Stamps */}
                <motion.div
                    style={{ opacity: likeOpacity }}
                    className="absolute top-8 left-8 border-4 border-green-500 text-green-500 rounded-lg px-4 py-2 transform -rotate-12 font-bold text-4xl tracking-widest uppercase bg-black/20 backdrop-blur-sm"
                >
                    Interested
                </motion.div>

                <motion.div
                    style={{ opacity: nopeOpacity }}
                    className="absolute top-8 right-8 border-4 border-red-500 text-red-500 rounded-lg px-4 py-2 transform rotate-12 font-bold text-4xl tracking-widest uppercase bg-black/20 backdrop-blur-sm"
                >
                    Nope
                </motion.div>
            </div>

            {/* Content */}
            <Link href={`/events/${event.id}`} className="block h-[25%] p-5 flex flex-col justify-between bg-white hover:bg-gray-50 transition-colors">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 line-clamp-1">{event.title}</h2>
                    <div className="flex items-center text-gray-600 mt-2 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{event.location.name}, {event.location.city}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{event.time}</span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
