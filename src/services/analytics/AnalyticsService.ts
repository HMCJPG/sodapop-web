export const AnalyticsService = {
    trackAction: (actionType: string, eventId: string, metadata?: object) => {
        console.log(`[Analytics] Action: ${actionType}`, { eventId, ...metadata });

        // Future integration with Mixpanel/GA would go here
    }
};

export const AnalyticsActions = {
    SWIPE_RIGHT: "SWIPE_RIGHT",
    SWIPE_LEFT: "SWIPE_LEFT",
    VIEW_DETAILS: "VIEW_DETAILS",
    CLICK_TICKET: "CLICK_TICKET",
};
