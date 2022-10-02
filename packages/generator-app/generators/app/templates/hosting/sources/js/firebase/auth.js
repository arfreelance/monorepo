import { getAuth } from "firebase/auth";
import app from "./app.js";

// Auth
// -----------------------------------------------------------------------------

export const auth = getAuth(app);

// Default
// -----------------------------------------------------------------------------

export default auth;
