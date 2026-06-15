// ==============================
// FÉNIX LABS - MAIN JS
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const scrollProgress = document.getElementById("scrollProgress");

  if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-controls", navLinks.id);
    menuToggle.setAttribute("aria-expanded", "false");

    const closeMenu = () => {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("active")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("active")
        && !navLinks.contains(event.target)
        && !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrollPercent}%`;
    }
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  updateScrollProgress();

});
