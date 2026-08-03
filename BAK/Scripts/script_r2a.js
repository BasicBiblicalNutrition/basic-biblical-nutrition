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

const links = document.querySelectorAll('.nav-links a');
const underline = document.getElementById('underline');

function moveUnderline(el) {
  const rect = el.getBoundingClientRect();
  const parentRect = el.parentElement.getBoundingClientRect();

  underline.style.width = rect.width + 'px';
  underline.style.left = (rect.left - parentRect.left) + 'px';
}

/* 02 - MOBILE MENU */

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

/* 03 - PAGE INITIALIZATION */

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

/* 04 - CAROUSEL */

const track = document.querySelector('.feature-carousel');
const prevBtn = document.querySelector('.carousel-arrow.left');
const nextBtn = document.querySelector('.carousel-arrow.right');

if (track && prevBtn && nextBtn) {

    const scrollAmount = track.clientWidth * 0.92;

  function updateArrows() {

    prevBtn.disabled = track.scrollLeft <= 5;

    nextBtn.disabled =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;

  }

  prevBtn.addEventListener('click', () => {
    track.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });

    setTimeout(updateArrows, 350);
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });

    setTimeout(updateArrows, 350);
  });

}

track.addEventListener('scroll', updateArrows);

window.addEventListener('resize', updateArrows);

updateArrows();





