/*
=====================================================
FlipBook
JavaScript Ver 1

SECTION INDEX

01 - Navigation Underline
02 - Mobile Menu
03 - Page Initialization

=====================================================
*/

document.getElementById("home").addEventListener("click", () => {
  window.location.href = "../index.html";
});

const moreButton = document.getElementById("more");
const moreMenu = document.getElementById("moreMenu");

moreButton.addEventListener("click", () => {
  const isOpen = !moreMenu.hidden;

  moreMenu.hidden = isOpen;
  moreButton.setAttribute("aria-expanded", String(!isOpen));
});