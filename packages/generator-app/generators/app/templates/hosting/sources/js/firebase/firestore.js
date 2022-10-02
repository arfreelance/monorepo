import { getFirestore } from "firebase/firestore/lite";
import app from "./app.js";

// Firestore
// -----------------------------------------------------------------------------

export const firestore = getFirestore(app);

// Default
// -----------------------------------------------------------------------------

export default firestore;
