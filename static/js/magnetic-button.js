(() => {
  if (typeof gsap === 'undefined') return; // GSAP required

  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  if (isTouch) return;

  function resetMagnet(button, text) {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 2.5,
      ease: "elastic.out(1.2, 0.2)"
    });

    if (text) {
      gsap.to(text, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power3.out"
      });
    }
  }

  const magneticRadiusDefault = 120;

  document.addEventListener("mousemove", (e) => {
    const buttons = document.querySelectorAll(".magnetic-button");

    buttons.forEach((button) => {
      const rect = button.getBoundingClientRect();
      const buttonCenterX = rect.left + rect.width / 2;
      const buttonCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - buttonCenterX;
      const distanceY = e.clientY - buttonCenterY;
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

      const text = button.querySelector("span") || button.firstElementChild;

      const radius = Number.isFinite(parseFloat(button.dataset.magneticRadius)) ? parseFloat(button.dataset.magneticRadius) : magneticRadiusDefault;

      if (distance < radius) {
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const strength = Number.isFinite(parseFloat(button.dataset.strength)) ? (parseFloat(button.dataset.strength) / 100) : 0.5;
        const textStrength = Number.isFinite(parseFloat(button.dataset.strengthText)) ? (parseFloat(button.dataset.strengthText) / 100) : 0.2;

        gsap.to(button, {
          x: offsetX * strength,
          y: offsetY * strength,
          duration: Number.isFinite(parseFloat(button.dataset.duration)) ? parseFloat(button.dataset.duration) : 0.5,
          ease: button.dataset.ease || "power3.out",
          overwrite: "auto" 
        });

        if (text) {
          gsap.to(text, {
            x: offsetX * textStrength,
            y: offsetY * textStrength,
            duration: Number.isFinite(parseFloat(button.dataset.durationText)) ? parseFloat(button.dataset.durationText) : 0.5,
            ease: button.dataset.innerEase || "power3.out",
            overwrite: "auto"
          });
        }

        if (button.resetTimer) {
          clearTimeout(button.resetTimer);
          button.resetTimer = null;
        }
      } else {
        if (!button.resetTimer) {
          button.resetTimer = setTimeout(() => {
            resetMagnet(button, text);
            button.resetTimer = null;
          }, 200); 
        }
      }
    });
  });

  // Also reset when the mouse leaves the window
  window.addEventListener('mouseleave', () => {
    document.querySelectorAll('.magnetic-button').forEach((button) => {
      const text = button.querySelector("span") || button.firstElementChild;
      resetMagnet(button, text);
    });
  });

})();
