"use strict";

alert("bbn_tooltips.js loaded");
/* ==========================================================
   Basic Biblical Nutrition
   Scripture Tooltip System
   ========================================================== */

const BBN_SCRIPTURES = {

    "IS_58_11": {
        reference: "IS 58:11 (KJV)",
        text: "And the LORD shall guide thee continually, and satisfy thy soul in drought, and make fat thy bones: and thou shalt be like a watered garden, and like a spring of water, whose waters fail not."
    }

};

document.addEventListener("DOMContentLoaded", () => {

    const hotspots = document.querySelectorAll(".bbn-hotspot");

    hotspots.forEach(hotspot => {

        hotspot.addEventListener("mouseenter", showTooltip);
        hotspot.addEventListener("mouseleave", hideTooltip);

    });

});

function showTooltip(event){

    const id = event.currentTarget.dataset.bbnScripture;

    const scripture = BBN_SCRIPTURES[id];

    if(!scripture) return;

    console.log(scripture.reference);

}

function hideTooltip(){

}