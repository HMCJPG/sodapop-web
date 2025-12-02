import { EventProvider } from "./EventProvider";
import { MockEventProvider } from "./MockEventProvider";
import { ScraperEventProvider } from "./ScraperEventProvider";
import { FirebaseEventProvider } from "./FirebaseEventProvider";

const DATA_SOURCE = process.env.DATA_SOURCE || "MOCK";
const USE_FIREBASE = process.env.NEXT_PUBLIC_USE_FIREBASE === "true";

export function getEventProvider(): EventProvider {
    if (USE_FIREBASE) {
        return new FirebaseEventProvider();
    }

    if (DATA_SOURCE === "SCRAPER") {
        return new ScraperEventProvider();
    }

    return new MockEventProvider();
}
