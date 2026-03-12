document.addEventListener("DOMContentLoaded", () => {

  const scroller = scrollama();

  const textLayer = document.getElementById("text-layer");
  const backgroundLayer = document.getElementById("background-layer");
  const steps = document.querySelectorAll(".step");
  const landingLayer = document.getElementById("landing-layer");

  const landingHeight = landingLayer.offsetHeight;

  // ====== SCROLLAMA SETUP ======
  scroller
    .setup({
      step: ".step",
      offset: 0.5
    })
    .onStepEnter((response) => {
      console.log("Step:", response.index);
    });

  // Update maxScroll bij resize
  window.addEventListener("resize", () => {
    // landingHeight kan veranderen bij resize
    landingHeight = landingLayer.offsetHeight;
  });

  // ====== FASE 1: landing scrollen, FASE 2: storytelling ======
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY < landingHeight) {
      // FASE 1: alleen landing scroll
      textLayer.style.transform = "translateY(0px)";
      backgroundLayer.style.transform = "translateY(0px)";
    } else {
      // FASE 2: storytelling scroll
      const storyScroll = scrollY - landingHeight;
      textLayer.style.transform = `translateY(${-storyScroll}px)`;
      backgroundLayer.style.transform = `translateY(${-storyScroll * 0.6}px)`;
    }
  });

});
