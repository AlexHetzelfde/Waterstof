document.addEventListener("DOMContentLoaded", () => {
  const landing = document.getElementById("landing-layer");
  const bgSlides = document.querySelectorAll(".bg-slide");
  const navDotsContainer = document.getElementById("nav-dots");
  const progressBar = document.getElementById("progress-bar");
  const infoScenes = document.querySelectorAll(".scene[data-type='info']");
  const allScenes = document.querySelectorAll(".scene");

  let progress = 0;
  let locked = true;

  document.body.style.overflow = "hidden";

  // === BEGRIPPEN ===
  const begrippen = {
    membraan: {
      titel: "Membraan",
      uitleg: "Een dunne, semi-doorlaatbare laag in een PEM-elektrolyser die de waterstof- en zuurstofzijde scheidt, maar wel protonen (H⁺) doorlaat."
    },
    minpool: {
      titel: "Minpool (kathode)",
      uitleg: "De negatieve pool in de elektrolyser. Hier stromen elektronen naartoe, waardoor waterstofionen worden omgezet in waterstofgas (H₂)."
    },
    pluspool: {
      titel: "Pluspool (anode)",
      uitleg: "De positieve pool in de elektrolyser. Hier worden watermoleculen gesplitst en komt zuurstofgas (O₂) vrij."
    },
    diafragma: {
      titel: "Diafragma",
      uitleg: "Een poreuze scheidingswand in alkalische elektrolysers die voorkomt dat waterstof en zuurstof zich vermengen."
    },
    efficientie_claim: {
      titel: "Waarom kost dit extra energie?",
      uitleg: "Comprimeren tot 700 bar vereist krachtige pompen. Afkoelen naar −253°C vereist energie-intensieve koelinstallaties. Beide processen zorgen voor verlies in de keten, waardoor het totale rendement van groene waterstof vandaag uitkomt op zo'n 25–35%."
    }
  };

  document.addEventListener("click", (e) => {
    const span = e.target.closest(".begrip");
    const existing = document.querySelector(".begrip-popup");

    if (existing) {
      const wasForSame = existing.dataset.for === (span ? span.dataset.begrip : "");
      existing.remove();
      if (!span || wasForSame) return;
    }

    if (!span) return;

    const begrip = begrippen[span.dataset.begrip];
    if (!begrip) return;

    const rect = span.getBoundingClientRect();
    const popup = document.createElement("div");
    popup.classList.add("begrip-popup");
    popup.dataset.for = span.dataset.begrip;

    // Klasse voor claim (andere accentkleur)
    if (span.dataset.begrip === "efficientie_claim") {
      popup.classList.add("begrip-popup--claim");
    }

    popup.innerHTML = `
      <button class="begrip-sluit" aria-label="Sluiten">×</button>
      <strong>${begrip.titel}</strong>
      <p>${begrip.uitleg}</p>
    `;

    // Positie onder het woord, binnen viewport houden
    const popupWidth = 260;
    let left = rect.left;
    if (left + popupWidth > window.innerWidth - 16) {
      left = window.innerWidth - popupWidth - 16;
    }
    if (left < 8) left = 8;

    // Pijltje uitlijnen op het woord
    const arrowLeft = Math.max(10, Math.min(rect.left + rect.width / 2 - left - 8, popupWidth - 20));
    popup.style.setProperty("--arrow-left", arrowLeft + "px");
    popup.style.left = left + "px";
    popup.style.top = (rect.bottom + window.scrollY + 10) + "px";

    document.body.appendChild(popup);

    popup.querySelector(".begrip-sluit").addEventListener("click", (e) => {
      e.stopPropagation();
      popup.remove();
    });
  });

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

  // === ACHTERGROND ===
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
      navDotsContainer.classList.add("visible");
    }
    if (progress < 1 && !locked) {
      locked = true;
      document.body.style.overflow = "hidden";
      navDotsContainer.classList.remove("visible");
    }
  }

  // === PROGRESS BAR ===
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((scrollTop / docHeight) * 100) + "%";
  });

  // === KEYBOARD ===
  window.addEventListener("keydown", (e) => {
    if (locked) {
      if (e.key === "ArrowDown" || e.key === "PageDown") setProgress(progress + 0.15);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      const currentScroll = window.scrollY;
      for (let i = 0; i < allScenes.length; i++) {
        if (allScenes[i].offsetTop > currentScroll + 10) {
          allScenes[i].scrollIntoView({ behavior: "smooth" });
          break;
        }
      }
    }
    if (e.key === "ArrowUp" || e.key === "PageUp") {
      if (window.scrollY === 0) { setProgress(progress - 0.15); return; }
      const currentScroll = window.scrollY;
      for (let i = allScenes.length - 1; i >= 0; i--) {
        if (allScenes[i].offsetTop < currentScroll - 10) {
          allScenes[i].scrollIntoView({ behavior: "smooth" });
          break;
        }
      }
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
    .setup({ step: ".scene", offset: 0.5, progress: true })
    .onStepEnter(({ element }) => {
      const bgIndex = parseInt(element.dataset.bg);
      if (!isNaN(bgIndex)) setBackground(bgIndex);

      if (element.dataset.type === "info") {
        updateNavDots(parseInt(element.dataset.index));
        element.querySelector(".textbox").classList.add("visible");
        const video = element.querySelector("video");
        if (video) video.play().catch(() => {});

      } else if (element.dataset.type === "infographic") {
        element.querySelector(".infographic-label").classList.add("visible");

      } else if (element.dataset.type === "einde") {
        element.querySelector(".einde-box").classList.add("visible");
      }
    })
    .onStepExit(({ element }) => {
      if (element.dataset.type === "info") {
        element.querySelector(".textbox").classList.remove("visible");
        const video = element.querySelector("video");
        if (video) { video.pause(); video.currentTime = 0; }
        const container = element.querySelector(".video-container");
        if (container) container.style.opacity = 0;

      } else if (element.dataset.type === "infographic") {
        element.querySelector(".infographic-label").classList.remove("visible");

      } else if (element.dataset.type === "einde") {
        element.querySelector(".einde-box").classList.remove("visible");
      }
    })
    .onStepProgress(({ element, progress }) => {
      // Video vaagt in naarmate de gebruiker door de scene scrollt
      if (element.classList.contains("has-video")) {
        const container = element.querySelector(".video-container");
        if (container) container.style.opacity = Math.min(1, progress * 2.5);
      }
    });

  window.addEventListener("resize", scroller.resize);
});
