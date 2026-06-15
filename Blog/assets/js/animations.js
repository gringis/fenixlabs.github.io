// ==============================
// FENIX LABS - ANIMATIONS JS
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

  // Por si algo queda arriba de la pantalla al cargar
  setTimeout(() => {
    revealElements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (rect.top < window.innerHeight) {
        element.classList.add("active");
      }
    });
  }, 100);
});
