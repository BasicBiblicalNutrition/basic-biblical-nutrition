
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

    const count = snap.data().count;

    console.log("Site Visits:", count);

    const counter = document.getElementById("site-visit-count");

    if (counter) {
        counter.textContent = count;
    }
}

countVisit();