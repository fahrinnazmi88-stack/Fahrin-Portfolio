// nav.js - Menguruskan interaktiviti Navigasi Bar
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        // Jika nama fail sepadan dengan URL semasa, letak kelas 'active'
        if (link.getAttribute("href") === currentPath || (currentPath === "" && link.getAttribute("href") === "index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});