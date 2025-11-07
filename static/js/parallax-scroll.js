(function() {
  const hero = document.getElementById('parralax-header');
  const about = document.getElementById('parralax-body');
  if (!hero || !about) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function updateParallax() {
    // Hero: slower scroll (0.5x)
    hero.style.transform = `translateY(${lastScrollY * 0.3}px)`;
    about.style.transform = `translateY(${-lastScrollY * 0.1}px)`;
    ticking = false;
  }

  window.addEventListener('scroll', onScroll);
})();
