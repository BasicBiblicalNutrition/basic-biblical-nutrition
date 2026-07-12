"use strict";

const DEBUG = true;



const BBN_SCRIPTURES = {

    "IS_58_11": {
        reference: "Isaiah 58:11 (KJV)",
        text:
                    `And the LORD shall guide thee continually,
                     and satisfy thy soul in drought,
                     and make fat thy bones:
                     and thou shalt be like a watered garden,
                     and like a spring of water,
                     whose waters fail not.`
    },
    
    "MT_5_16":  {
        reference: "Matthew 5:16 (KJV)",
        text:      
                   `Let your light so shine before men, 
                    that they may see your good works, 
                    and glorify your Father which is in heaven.`
    }
};

document.addEventListener("DOMContentLoaded", () => {

    const tooltip = document.createElement("div");

    tooltip.id = "bbnTooltip";

    document.body.appendChild(tooltip);

    const hotspots = document.querySelectorAll(".bbn-hotspot");

    hotspots.forEach(hotspot => {

        if (DEBUG) {
           hotspot.classList.add("debug");
        }

        hotspot.addEventListener("mouseenter", () => {

           const type = hotspot.dataset.bbnType;
           const id   = hotspot.dataset.bbnId;

          if (type !== "scripture") return;

           const verse = BBN_SCRIPTURES[id];

           tooltip.innerHTML =
           "<strong>" + verse.reference + "</strong><br><br>" +
           verse.text;

           const r = hotspot.getBoundingClientRect();

           tooltip.style.display = "block";

           tooltip.style.left =
                   (window.scrollX + r.right + 20) + "px";

           tooltip.style.top =
                   (window.scrollY + r.top - 10) + "px";

        });



        hotspot.addEventListener("mouseleave", () => {

            tooltip.style.display = "none";

        });

    });

});