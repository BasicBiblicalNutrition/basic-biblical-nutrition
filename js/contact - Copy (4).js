import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const contactForm = document.getElementById("contact-form");


contactForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const from = document.getElementById("contact-from").value;
    const subject = document.getElementById("contact-subject").value;
    const body = document.getElementById("contact-body").value;
    const mailingList = document.getElementById("mailing-list").value;

    try {

        await addDoc(collection(db, "contact_messages"), {
            from: from,
            subject: subject,
            body: body,
            mailingList: mailingList,
            createdAt: serverTimestamp()
        });

        contactForm.submit();

    } catch (error) {

        console.error("Error sending message:", error);

        alert("Sorry, there was a problem sending your message.");
    }
});
