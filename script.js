document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing-layer");
  const bgSlides = document.querySelectorAll(".bg-slide");
  const yearDisplay = document.getElementById("year-display");
  let progress = 0;
  let locked = true;

  document.body.style.overflow = "hidden";

  function setBackground(index) {
    bgSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  function setProgress(p) {
    progress = Math.max(0, Math.min(1, p));
    landing.style.transform = `translateY(-${progress * 100}vh)`;
    if (progress >= 1 && locked) {
      locked = false;
      document.body.style.overflow = "auto";
      yearDisplay.classList.add("visible");
    }
    if (progress < 1 && !locked) {
      locked = true;
      document.body.style.overflow = "hidden";
      yearDisplay.classList.remove("visible");
    }
  }

  window.addEventListener("wheel", (e) => {
    if (locked) {
      e.preventDefault();
      setProgress(progress + e.deltaY / window.innerHeight);
      return;
    }
    if (window.scrollY === 0 && e.deltaY < 0) {
      e.preventDefault();
      setProgress(progress + e.deltaY / window.innerHeight);
    }
  }, { passive: false });

  let touchStartY = 0;
  window.addEventListener("touchstart", e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener("touchmove", e => {
    if (locked) {
      e.preventDefault();
      const delta = touchStartY - e.touches[0].clientY;
      touchStartY = e.touches[0].clientY;
      setProgress(progress + delta / window.innerHeight);
    }
  }, { passive: false });

  // === SCROLLAMA ===
  const scroller = scrollama();
  scroller
    .setup({
      step: ".scene",
      offset: 0.5,
      progress: true  // dit zet onStepProgress aan
    })
    .onStepEnter(({ element }) => {
      const index = parseInt(element.dataset.index);
      setBackground(index);
    })
    .onStepProgress(({ element, progress }) => {
      const yearStart = parseInt(element.dataset.year);
      const next = element.nextElementSibling;
      const yearEnd = next ? parseInt(next.dataset.year) : yearStart;
      yearDisplay.textContent = Math.round(yearStart + (yearEnd - yearStart) * progress);
    });

  window.addEventListener("resize", scroller.resize);
});
