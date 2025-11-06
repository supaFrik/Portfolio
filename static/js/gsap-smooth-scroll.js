// Custom GSAP-based smooth scroll (free alternative to ScrollSmoother)
(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  const scroller = document.querySelector('#smooth-scroll');
  if (!scroller) return;
  if ('ontouchstart' in window || navigator.maxTouchPoints > 1 || window.matchMedia('(max-width: 768px)').matches) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.set(scroller, { y: 0 });
  function setBodyHeight() {
    document.body.style.height = Math.max(scroller.getBoundingClientRect().height, window.innerHeight) + 'px';
  }
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) { window.scrollTo(0, value); return; }
      return window.pageYOffset || document.documentElement.scrollTop;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: scroller.style.transform ? 'transform' : 'fixed'
  });
  const smoothness = 0.02;
  let current = 0;
  function raf() {
    const target = window.scrollY || window.pageYOffset;
    current += (target - current) * smoothness;
    gsap.set(scroller, { y: -current, overwrite: true });
    ScrollTrigger.update();
    requestAnimationFrame(raf);
  }
  window.addEventListener('resize', setBodyHeight);
  window.addEventListener('load', () => {
    setBodyHeight();
    requestAnimationFrame(raf);
    ScrollTrigger.addEventListener('refresh', setBodyHeight);
    ScrollTrigger.refresh();
  });
})();
