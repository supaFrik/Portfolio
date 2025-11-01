/* hover-clip.js
   Lightweight hover lock for .clip-fg spans on static pages.
   - On mouseenter: set clip to 0% (reveal)
   - On mouseleave: recompute clip based on element's center relative to viewport
   - Respects prefers-reduced-motion
*/

(function () {
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.debug('[hover-clip] prefers-reduced-motion: skipping');
    return;
  }

  const rows = Array.from(document.querySelectorAll('.projects-scroll .project-row'));
  if (!rows.length) {
    console.debug('[hover-clip] no project rows found');
    return;
  }

  function computeClipForRow(row) {
    const fg = row.querySelector('h2.project .clip-fg');
    if (!fg) return;
    const rect = row.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const centerY = rect.top + rect.height / 2;
    let progress = 1 - (centerY / viewportH);
    progress = Math.min(Math.max(progress, 0), 1);
    const clipPercent = (1 - progress) * 100;
    fg.style.setProperty('--clip', clipPercent + '%');
    fg.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
  }

  rows.forEach(row => {
    const fg = row.querySelector('h2.project .clip-fg');
    if (!fg) return;

    row.addEventListener('mouseenter', () => {
      fg.style.setProperty('--clip', '0%');
      fg.style.clipPath = 'inset(0 0% 0 0)';
      row.classList.add('hovering');
    });

    row.addEventListener('mouseleave', () => {
      row.classList.remove('hovering');
      computeClipForRow(row);
    });
  });

  // Recompute on resize/scroll for reasonable fallback behavior
  let raf = 0;
  function recomputeAll() {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      rows.forEach(r => {
        if (!r.classList.contains('hovering')) computeClipForRow(r);
      });
      raf = 0;
    });
  }

  window.addEventListener('scroll', recomputeAll, { passive: true });
  window.addEventListener('resize', recomputeAll);

  // initial compute
  recomputeAll();
})();
