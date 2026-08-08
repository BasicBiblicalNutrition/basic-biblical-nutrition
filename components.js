

async function loadComponent(id, file) {

    const response = await fetch(file);
    const html = await response.text();

    document.getElementById(id).innerHTML = html;

    // Highlight current page
    const currentPage =
        window.location.pathname.split("/").pop() || "index_r7.html";

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
    await loadComponent("hero", "hero.html");

  
    await loadComponent("home-overview", "home_overview.html");
    await initializeHomeOverview();
    await initializeTake2();

    await loadComponent("feature-section", "feature_section.html");
    await initializeFeatureCarousel();

    await loadComponent("journey-container", "journey_section.html");

    initializeHero();

    initializeCarousels();
    initializeTooltips();
 

}

initializePage();





