

async function loadComponent(id, file) {

    const response = await fetch(file);
    const html = await response.text();

    const element = document.getElementById(id);
    if (!element) return;
    element.innerHTML = html;

    // Highlight current page
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".banner-nav a").forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }

    });

}

async function initializeHomeOverview() {

    await loadComponent("home-overview-left", "home_overview_left.html");
    await loadComponent("home-take2", "home_take2.html");

}

async function initializePage() {

    await loadComponent("site-banner", "site_banner.html");

    // Mobile hamburger menu
    const menuButton = document.querySelector(".bbn-menu-toggle");
    const bannerNav = document.querySelector(".banner-nav");

    if (menuButton && bannerNav) {
        menuButton.addEventListener("click", () => {
            bannerNav.classList.toggle("mobile-open");
            menuButton.setAttribute(
                "aria-label",
                bannerNav.classList.contains("mobile-open")
                    ? "Close Navigation"
                    : "Open Navigation"
            );
        });
    }

    await loadComponent("hero", "hero.html");

  
    await loadComponent("home-overview", "home_overview.html");
    await initializeHomeOverview();
    await initializeTake2();
    await initializeTake2();

    await loadComponent("feature-section", "feature_section.html");
    await initializeFeatureCarousel();

    await loadComponent("journey-container", "journey_section.html");

    initializeHero();

    initializeCarousels();
    initializeTooltips();
 

    await loadComponent("site-footer", "site_footer.html");
    
    // Show visitor counter only on the home page
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    if (currentPage !== "index.html") {
        const visitorLine = document.getElementById("site-visit-count");
        if (visitorLine) {
            visitorLine.parentElement.style.display = "none";
        }
    }
}

initializePage();





