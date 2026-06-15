document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles-canvas");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!canvas || reduceMotion.matches) return;

  const context = canvas.getContext("2d");
  if (!context) return;

  let particles = [];
  let animationFrame = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function createParticles() {
    const amount = width < 760 ? 16 : 32;

    particles = Array.from({ length: amount }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.4 + 0.5,
      speedX: (Math.random() - 0.5) * 0.12,
      speedY: Math.random() * 0.18 + 0.05,
      color: index % 5 === 0 ? "249, 115, 22" : "6, 182, 212",
      alpha: Math.random() * 0.32 + 0.12,
    }));
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    createParticles();
  }

  function draw() {
    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y -= particle.speedY;

      if (particle.y < -4) {
        particle.y = height + 4;
        particle.x = Math.random() * width;
      }

      if (particle.x < -4) particle.x = width + 4;
      if (particle.x > width + 4) particle.x = -4;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
      context.fill();
    });

    animationFrame = window.requestAnimationFrame(draw);
  }

  function handleVisibility() {
    window.cancelAnimationFrame(animationFrame);
    if (!document.hidden) draw();
  }

  resizeCanvas();
  draw();

  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", handleVisibility);
});
