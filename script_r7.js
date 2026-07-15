/*
=====================================================
Basic Biblical Nutrition
JavaScript R2a

SECTION INDEX

01 - Navigation Underline
02 - Mobile Menu
03 - Page Initialization

=====================================================
*/


/* 01 - NAVIGATION UNDERLINE */
/**
const links = document.querySelectorAll('.nav-links a');
const underline = document.getElementById('underline');

function moveUnderline(el) {
  const rect = el.getBoundingClientRect();
  const parentRect = el.parentElement.getBoundingClientRect();

  underline.style.width = rect.width + 'px';
  underline.style.left = (rect.left - parentRect.left) + 'px';
}

 02 - MOBILE MENU 

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

 03 - PAGE INITIALIZATION 

const currentPage = window.location.pathname.split('/').pop();

links.forEach(link => {

  if (link.getAttribute('href') === currentPage) {
    moveUnderline(link);
  }

  link.addEventListener('mouseenter', () => moveUnderline(link));
});

document.querySelector('.nav-links').addEventListener('mouseleave', () => {

  links.forEach(link => {

    if (link.getAttribute('href') === currentPage) {
      moveUnderline(link);
    }
  });
});

window.onload = () => {

  links.forEach(link => {

    if (link.getAttribute('href') === currentPage) {
      moveUnderline(link);
    }
  });
};
**/



/*=====================================================
  COMPONENT
  Hero Image Rotator
  Version 0.1
=====================================================*/

const heroImages = document.querySelectorAll(".hero-image");

let currentHero = 0;

setInterval(() => {

    heroImages[currentHero].classList.remove("active");

    currentHero++;

    if (currentHero >= heroImages.length) {
        currentHero = 0;
    }

    heroImages[currentHero].classList.add("active");

}, 12000);      // change every 12 seconds




/*=====================================================
  Reusable Carousel
=====================================================*/

function setupCarousel(trackSel, prevSel, nextSel, direction = "horizontal") {

    const track = document.querySelector(trackSel);
    const prevBtn = document.querySelector(prevSel);
    const nextBtn = document.querySelector(nextSel);

    if (!track || !prevBtn || !nextBtn) return;

    const scrollAmount =
        direction === "horizontal"
            ? track.clientWidth * 0.92
            : track.clientHeight * 0.92;

    function updateArrows() {

        if (direction === "horizontal") {

            prevBtn.disabled = track.scrollLeft <= 5;

            nextBtn.disabled =
                track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

        } else {

            prevBtn.disabled = track.scrollTop <= 5;

            nextBtn.disabled =
                track.scrollTop + track.clientHeight >= track.scrollHeight - 5;
        }
    }

    prevBtn.addEventListener("click", () => {

        track.scrollBy(
            direction === "horizontal"
                ? { left: -scrollAmount, behavior: "smooth" }
                : { top: -scrollAmount, behavior: "smooth" }
        );

        setTimeout(updateArrows, 350);

    });

    nextBtn.addEventListener("click", () => {

        track.scrollBy(
            direction === "horizontal"
                ? { left: scrollAmount, behavior: "smooth" }
                : { top: scrollAmount, behavior: "smooth" }
        );

        setTimeout(updateArrows, 350);

    });

    track.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);

    updateArrows();
}

/* My Momma carousel */

setupCarousel(
    ".feature-carousel",
    ".carousel-arrow.left",
    ".carousel-arrow.right",
    "horizontal"
);

/* Take 2 carousel */

setupCarousel(
    ".take2-list",
    ".take2-arrow.up",
    ".take2-arrow.down",
    "vertical"
);


/*=====================================================
  COMPONENT
  Accessibility
=====================================================*/

function toggleLargeText() {

    document.body.dropdown-content.toggle("large-text");

}




