document.addEventListener("DOMContentLoaded", () => {

  const landing = document.getElementById("landing-layer");

  let unlocked = false;
  let scrollamaStarted = false;

  const vh = window.innerHeight;

  // =========================
  // GORDIJN SCROLL LOGICA
  // =========================

  window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;

    // FASE 1: INTRO (gordijn actief)
    if (scrollY < vh) {

      const progress = scrollY / vh;

      // zwart scherm beweegt omhoog (GEEN fade)
      landing.style.transform = `translateY(-${progress * 100}vh)`;

      // lock effect (voelt als “niet echt door kunnen scrollen”)
      document.body.style.overflow = "hidden";

    }

    // FASE 2: UNLOCK
    if (scrollY >= vh && !unlocked) {

      unlocked = true;

      // forceer gordijn volledig weg
      landing.style.transform = "translateY(-100vh)";

      // scroll weer vrijgeven
      document.body.style.overflow = "auto";

      // start scrollama pas hier
      startScrollama();
    }

  });

  // =========================
  // SCROLLAMA INIT
  // =========================

  function startScrollama() {

    if (scrollamaStarted) return;
    scrollamaStarted = true;

    const scroller = scrollama();

    scroller
      .setup({
        step: ".step",
        offset: 0.5
      })
      .onStepEnter((response) => {

        document.querySelectorAll(".step").forEach(step => {
          step.classList.remove("active");
        });

        response.element.classList.add("active");

      });

    window.addEventListener("resize", scroller.resize);
  }

});
