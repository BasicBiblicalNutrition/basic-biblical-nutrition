import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const contactForm = document.getElementById("contact-form");


contactForm.addEventListener("submit", async (event) => {

    // Take control of the submission so Web3Forms does not
    // replace our BBN thank-you page with its own success page.
    event.preventDefault();
    event.stopImmediatePropagation();

    const captcha = contactForm.querySelector(
        'textarea[name="h-captcha-response"]'
    );

    if (!captcha || !captcha.value) {
        alert("Please fill out captcha field");
        return;
    }

    const from = document.getElementById("contact-from").value;
    const subject = document.getElementById("contact-subject").value;
    const body = document.getElementById("contact-body").value;
    const mailingList = document.getElementById("mailing-list").value;

    try {
        // Save the message to Firestore first.
        await addDoc(collection(db, "contact_messages"), {
            from: from,
            subject: subject,
            body: body,
            mailingList: mailingList,
            createdAt: serverTimestamp()
        });

        // Send the same form to Web3Forms for the email.
        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                headers: {
                    "Accept": "application/json"
                },
                body: new FormData(contactForm)
            }
        );

        const result = await response.json();

        if (response.ok && result.success) {
            window.location.href =
                "https://basicbiblicalnutrition.github.io/basic-biblical-nutrition/contact_thankYou.html";
            return;
        }

        console.error("Web3Forms error:", result);
        alert("Sorry, there was a problem sending your message.");

    } catch (error) {
        console.error("Error sending message:", error);
        alert("Sorry, there was a problem sending your message.");
    }
});
