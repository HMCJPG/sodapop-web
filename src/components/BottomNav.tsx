"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Heart, User as UserIcon } from "lucide-react";
import clsx from "clsx";

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 pb-safe z-50">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                <Link
                    href="/"
                    className={clsx(
                        "flex flex-col items-center justify-center w-full h-full transition-colors",
                        pathname === "/" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <Compass className="w-6 h-6" />
                    <span className="text-xs mt-1 font-medium">Discover</span>
                </Link>

                <Link
                    href="/saved"
                    className={clsx(
                        "flex flex-col items-center justify-center w-full h-full transition-colors",
                        pathname === "/saved" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <Heart className="w-6 h-6" />
                    <span className="text-xs mt-1 font-medium">Saved</span>
                </Link>

                <Link
                    href="/profile"
                    className={clsx(
                        "flex flex-col items-center justify-center w-full h-full transition-colors",
                        pathname === "/profile" ? "text-rose-500" : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    <UserIcon className="w-6 h-6" />
                    <span className="text-xs mt-1 font-medium">Profile</span>
                </Link>
            </div>
        </div>
    );
}
