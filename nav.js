// nav.js - Auto-highlight active nav link (desktop + mobile)
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    // Desktop nav
    document.querySelectorAll(".nav-links a").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    // Mobile nav
    document.querySelectorAll(".mobile-menu a").forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });
});