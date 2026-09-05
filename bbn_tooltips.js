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

const BBN_TERMS = {
    "genetics": {
        title: "Genetics",
        text: "The inherited instructions in our DNA that contribute to how our bodies function."
    },
    "epigenetics": {
        title: "Epigenetics",
        text: "Processes that can influence how genes are expressed without changing the underlying DNA sequence."
    }
};

/*  document.addEventListener("DOMContentLoaded", () => {  */

function initializeTooltips() {

    const tooltip = document.createElement("div");

    tooltip.id = "bbnTooltip";

    document.body.appendChild(tooltip);

    const hotspots = document.querySelectorAll(".bbn-hotspot, .bfn-term");

/*    hotspots.forEach(hotspot => {   */

    hotspots.forEach(hotspot => {

        if (hotspot.dataset.initialized) return;
              hotspot.dataset.initialized = "true";

        if (DEBUG) {
           hotspot.classList.add("debug");
        }

        hotspot.addEventListener("mouseenter", () => {

            console.log("ENTER", hotspot);

           const type = hotspot.dataset.bbnType;
           const id   = hotspot.dataset.bbnId;

          let content;

           if (type === "scripture") {
               const verse = BBN_SCRIPTURES[id];
               if (!verse) return;

               content =
               "<strong>" + verse.reference + "</strong><br><br>" +
               verse.text;
           } else if (type === "term") {
               const term = BBN_TERMS[id];
               if (!term) return;

               content =
               "<strong>" + term.title + "</strong><br><br>" +
               term.text;
           } else {
               return;
           }

           tooltip.innerHTML = content;

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

}

/*  });  */