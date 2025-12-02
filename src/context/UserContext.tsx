"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";

interface UserContextType {
    user: User;
    saveEvent: (eventId: string) => void;
    passEvent: (eventId: string) => void;
    trackCreatedEvent: (eventId: string) => void;
    loading: boolean;
}

const DEFAULT_USER: User = {
    id: "test-user-1",
    name: "Soda Popper",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Soda",
    createdEventIds: [],
    savedEventIds: [],
    passedEventIds: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(DEFAULT_USER);
    const [loading, setLoading] = useState(true);
    const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === "true";

    useEffect(() => {
        if (!USE_FIREBASE) {
            // Use localStorage for mock mode
            if (typeof window !== "undefined") {
                const stored = localStorage.getItem("sodapop_user");
                if (stored) {
                    try {
                        setUser(JSON.parse(stored));
                    } catch (e) {
                        console.error("Failed to parse user", e);
                    }
                }
            }
            setLoading(false);
            return;
        }

        // Firebase mode
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                // Sign in anonymously if no user
                try {
                    const result = await signInAnonymously(auth);
                    firebaseUser = result.user;
                } catch (error) {
                    console.error("Error signing in anonymously:", error);
                    setLoading(false);
                    return;
                }
            }

            // Check if user document exists in Firestore
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                // Create new user document
                const newUser: User = {
                    id: firebaseUser.uid,
                    name: "Soda Popper",
                    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
                    createdEventIds: [],
                    savedEventIds: [],
                    passedEventIds: [],
                };

                await setDoc(userDocRef, newUser);
                setUser(newUser);
            } else {
                // User exists, set from Firestore
                const userData = userDoc.data() as User;
                setUser({
                    id: firebaseUser.uid,
                    name: userData.name || "Soda Popper",
                    avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
                    createdEventIds: userData.createdEventIds || [],
                    savedEventIds: userData.savedEventIds || [],
                    passedEventIds: userData.passedEventIds || [],
                });
            }

            // Listen to real-time updates
            const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const userData = doc.data() as User;
                    setUser({
                        id: firebaseUser!.uid,
                        name: userData.name || "Soda Popper",
                        avatarUrl: userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser!.uid}`,
                        createdEventIds: userData.createdEventIds || [],
                        savedEventIds: userData.savedEventIds || [],
                        passedEventIds: userData.passedEventIds || [],
                    });
                }
            });

            setLoading(false);

            return () => {
                unsubscribeSnapshot();
            };
        });

        return () => {
            unsubscribeAuth();
        };
    }, [USE_FIREBASE]);

    // Save user to localStorage whenever it changes (mock mode only)
    useEffect(() => {
        if (!USE_FIREBASE && typeof window !== "undefined") {
            localStorage.setItem("sodapop_user", JSON.stringify(user));
        }
    }, [user, USE_FIREBASE]);

    const saveEvent = async (eventId: string) => {
        if (!USE_FIREBASE) {
            // Mock mode: use local state
            setUser((prev) => {
                if (prev.savedEventIds.includes(eventId)) return prev;
                return { ...prev, savedEventIds: [...prev.savedEventIds, eventId] };
            });
            return;
        }

        // Firebase mode: update Firestore
        try {
            const userDocRef = doc(db, "users", user.id);
            await updateDoc(userDocRef, {
                savedEventIds: arrayUnion(eventId),
            });
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    const passEvent = async (eventId: string) => {
        if (!USE_FIREBASE) {
            // Mock mode: use local state
            setUser((prev) => {
                if (prev.passedEventIds?.includes(eventId)) return prev;
                return { ...prev, passedEventIds: [...(prev.passedEventIds || []), eventId] };
            });
            return;
        }

        // Firebase mode: update Firestore
        try {
            const userDocRef = doc(db, "users", user.id);
            await updateDoc(userDocRef, {
                passedEventIds: arrayUnion(eventId),
            });
        } catch (error) {
            console.error("Error passing event:", error);
        }
    };

    const trackCreatedEvent = async (eventId: string) => {
        if (!USE_FIREBASE) {
            // Mock mode: use local state
            setUser((prev) => {
                if (prev.createdEventIds.includes(eventId)) return prev;
                return { ...prev, createdEventIds: [eventId, ...prev.createdEventIds] };
            });
            return;
        }

        // Firebase mode: update Firestore
        try {
            const userDocRef = doc(db, "users", user.id);
            await updateDoc(userDocRef, {
                createdEventIds: arrayUnion(eventId),
            });
        } catch (error) {
            console.error("Error tracking created event:", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, saveEvent, passEvent, trackCreatedEvent, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
