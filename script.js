document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing-layer");
  const bgSlides = document.querySelectorAll(".bg-slide");
  const yearDisplay = document.getElementById("year-display");
  const navDotsContainer = document.getElementById("nav-dots");
  const progressBar = document.getElementById("progress-bar");
  const infoScenes = document.querySelectorAll(".scene[data-type='info']");

  let progress = 0;
  let locked = true;

  document.body.style.overflow = "hidden";

  // === NAV DOTS ===
  infoScenes.forEach((scene) => {
    const dot = document.createElement("div");
    dot.classList.add("nav-dot");
    dot.addEventListener("click", () => {
      scene.scrollIntoView({ behavior: "smooth" });
    });
    navDotsContainer.appendChild(dot);
  });

  function updateNavDots(index) {
    document.querySelectorAll(".nav-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // === ACHTERGROND (met zachte transitie) ===
  function setBackground(index) {
    bgSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  // === GORDIJN ===
  function setProgress(p) {
    progress = Math.max(0, Math.min(1, p));
    landing.style.transform = `translateY(-${progress * 100}vh)`;
    if (progress >= 1 && locked) {
      locked = false;
      document.body.style.overflow = "auto";
      yearDisplay.classList.add("visible");
      navDotsContainer.classList.add("visible");
    }
    if (progress < 1 && !locked) {
      locked = true;
      document.body.style.overflow = "hidden";
      yearDisplay.classList.remove("visible");
      navDotsContainer.classList.remove("visible");
    }
  }

  // === PROGRESS BAR + PARALLAX ===
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrollTop / docHeight) * 100) + "%";

    const activeSlide = document.querySelector(".bg-slide.active");
    if (activeSlide && activeSlide.style.backgroundImage) {
      activeSlide.style.backgroundPositionY = `calc(50% - ${scrollTop * 0.15}px)`;
    }
  });

  // === WHEEL ===
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

  // === TOUCH ===
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
      progress: true
    })
    .onStepEnter(({ element }) => {
      if (element.dataset.type === "info") {
        // Achtergrond wisselt alleen hier — bij nieuw infoboxje
        const index = parseInt(element.dataset.index);
        setBackground(index);
        updateNavDots(index);
        element.querySelector(".textbox").classList.add("visible");
      } else {
        // Quote verschijnt op dezelfde achtergrond, geen wissel
        element.querySelector(".quote-box").classList.add("visible");
      }
    })
    .onStepExit(({ element }) => {
      if (element.dataset.type === "info") {
        element.querySelector(".textbox").classList.remove("visible");
      } else {
        element.querySelector(".quote-box").classList.remove("visible");
      }
    })
    .onStepProgress(({ element, progress }) => {
      const yearStart = parseInt(element.dataset.year);
      const next = element.nextElementSibling;
      const yearEnd = next ? parseInt(next.dataset.year) : yearStart;
      yearDisplay.textContent = Math.round(yearStart + (yearEnd - yearStart) * progress);
    });

  window.addEventListener("resize", scroller.resize);
});
