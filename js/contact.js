import { db } from "./firebase-config.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();

    const captcha = contactForm.querySelector(
        'textarea[name="h-captcha-response"]'
    );

    if (!captcha || !captcha.value) {
        alert("Please fill out captcha field");
        return;
    }

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    try {
        // Send the email FIRST. This prevents a Firebase problem
        // from stopping the Web3Forms email from being delivered.
        const response = await fetch(
            "https://api.web3forms.com/submit",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error("Web3Forms error:", result);
            alert(
                "Web3Forms could not send the message.\n\n" +
                (result.message || "Unknown Web3Forms error.")
            );
            return;
        }

        // Save a copy to Firestore after Web3Forms accepts the email.
        await addDoc(collection(db, "contact_messages"), {
            from: data.email || "",
            subject: data.subject || "",
            body: data.message || "",
            mailingList: data.mailing_list || "",
            createdAt: serverTimestamp()
        });

        window.location.href =
            "https://basicbiblicalnutrition.github.io/basic-biblical-nutrition/contact_thankYou.html";

    } catch (error) {
        console.error("Contact form error:", error);
        alert(
            "Sorry, there was a problem sending your message.\n\n" +
            (error.message || error)
        );
    }
});
