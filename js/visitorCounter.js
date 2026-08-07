
import { db } from "./firebase-config.js";

import {
    doc,
    getDoc,
    updateDoc,
    increment
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

async function countVisit() {

    const ref = doc(db, "statistics", "site");

    await updateDoc(ref, {
        count: increment(1)
    });

    const snap = await getDoc(ref);

    console.log("Site Visits:", snap.data().count);
}

countVisit();

