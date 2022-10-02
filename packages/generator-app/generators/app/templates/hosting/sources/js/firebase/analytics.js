import { getAnalytics as initializer, isSupported } from "firebase/analytics";
import app from "./app.js";

// Analytics
// -----------------------------------------------------------------------------

export const getAnalyticsInitializer = (supported) => {
    return supported ? initializer : () => {};
};

export const getAnalytics = async (app) => {
    return getAnalyticsInitializer(await isSupported())(app);
};

export const analitycs = getAnalytics(app);

// Default
// -----------------------------------------------------------------------------

export default analitycs;
