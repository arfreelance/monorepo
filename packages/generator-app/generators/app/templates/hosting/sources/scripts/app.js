import { initializeApp } from "firebase/app";
import { initializeAnalytics, isSupported } from "firebase/analytics";

// Config
// -----------------------------------------------------------------------------

export const firebaseConfig = {};

// App
// -----------------------------------------------------------------------------

export const app = initializeApp(firebaseConfig);

// Analytics
// -----------------------------------------------------------------------------

export const getAnalyticsInitializer = (supported) => {
    return supported ? initializeAnalytics : () => {};
};

export const getSupportedAnalytics = async (app) => {
    return getAnalyticsInitializer(await isSupported())(app);
};

export const analytics = getSupportedAnalytics(app);

// Default
// -----------------------------------------------------------------------------

export default app;
