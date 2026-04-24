// script.js

document.addEventListener("DOMContentLoaded", () => {

  const landing = document.getElementById("landing-layer");

  /* zwart gordijn omhoog scrollen */
  window.addEventListener("scroll", () => {

    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / window.innerHeight, 1);

    landing.style.transform = `translateY(-${progress * 100}vh)`;
    landing.style.opacity = 1 - progress;

    if(progress >= 1){
      landing.style.pointerEvents = "none";
    } else {
      landing.style.pointerEvents = "auto";
    }

  });

  /* scrollama */
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

});
