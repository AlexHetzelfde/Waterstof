document.addEventListener("DOMContentLoaded", () => {

  const scroller = scrollama();

  const textLayer = document.getElementById("text-layer");
  const backgroundLayer = document.getElementById("background-layer");
  const steps = document.querySelectorAll(".step");
  const landingLayer = document.getElementById("landing-layer");

  let landingHeight = landingLayer.offsetHeight;

  // Scrollama setup
  scroller
    .setup({
      step: ".step",
      offset: 0.5
    })
    .onStepEnter((response) => {
      console.log("Step:", response.index);
    });

  // Update landingHeight bij resize
  window.addEventListener("resize", () => {
    landingHeight = landingLayer.offsetHeight;
  });

  // Scroll: landing eerst, storytelling daarna
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    if (scrollY < landingHeight) {
      // FASE 1: landing scrollt
      textLayer.style.transform = "translateY(0px)";
      backgroundLayer.style.transform = "translateY(0px)";
    } else {
      // FASE 2: storytelling scrollt
      const storyScroll = scrollY - landingHeight;
      textLayer.style.transform = `translateY(${-storyScroll}px)`;
      backgroundLayer.style.transform = `translateY(${-storyScroll * 0.6}px)`;
    }
  });

});
