

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

loadComponent("site-banner", "site_banner.html");

