document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing-layer");
  const bgSlides = document.querySelectorAll(".bg-slide");
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
    }
    if (progress < 1 && !locked) {
      locked = true;
      document.body.style.overflow = "hidden";
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

  // Touch support
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

  // Scrollama — wissel achtergrond per sectie
  const scroller = scrollama();
  scroller
    .setup({ step: ".scene", offset: 0.5 })
    .onStepEnter(({ element }) => {
      const index = parseInt(element.dataset.index);
      setBackground(index);
    });

  window.addEventListener("resize", scroller.resize);
});
