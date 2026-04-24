document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing-layer");
  let progress = 0;
  let unlocked = false;
  let scrollamaStarted = false;

  document.body.style.overflow = "hidden"; // pagina geblokkeerd

  function handleWheel(e) {
    if (unlocked) return;
    e.preventDefault();

    progress += e.deltaY / window.innerHeight;
    progress = Math.max(0, Math.min(1, progress));

    landing.style.transform = `translateY(-${progress * 100}vh)`;

    if (progress >= 1) unlock();
  }

  // Touch (mobiel)
  let touchStartY = 0;
  window.addEventListener("touchstart", e => { touchStartY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener("touchmove", e => {
    if (unlocked) return;
    e.preventDefault();
    const delta = touchStartY - e.touches[0].clientY;
    touchStartY = e.touches[0].clientY;
    progress += delta / window.innerHeight;
    progress = Math.max(0, Math.min(1, progress));
    landing.style.transform = `translateY(-${progress * 100}vh)`;
    if (progress >= 1) unlock();
  }, { passive: false });

  function unlock() {
    unlocked = true;
    landing.style.transform = "translateY(-100vh)";
    document.body.style.overflow = "auto"; // pagina vrijgeven
    window.removeEventListener("wheel", handleWheel);
    startScrollama();
  }

  window.addEventListener("wheel", handleWheel, { passive: false });

  function startScrollama() {
    if (scrollamaStarted) return;
    scrollamaStarted = true;
    const scroller = scrollama();
    scroller
      .setup({ step: ".step", offset: 0.5 })
      .onStepEnter((response) => {
        document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
        response.element.classList.add("active");
      });
    window.addEventListener("resize", scroller.resize);
  }
});
