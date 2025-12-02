import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SavedEventsProvider } from "@/context/SavedEventsContext";
import { BottomNav } from "@/components/BottomNav";

import { UserProvider } from "@/context/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SoDaPop",
  description: "Discover local community events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <SavedEventsProvider>
            <main className="min-h-screen bg-gray-100 pb-20 flex justify-center">
              <div className="w-full max-w-md min-h-screen bg-white shadow-2xl overflow-hidden relative">
                {children}
                <BottomNav />
              </div>
            </main>
          </SavedEventsProvider>
        </UserProvider>
      </body>
    </html>
  );
}
