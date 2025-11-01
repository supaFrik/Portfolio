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
  console.debug('[hover-clip] init');
  const rows = Array.from(document.querySelectorAll('.projects-scroll .project-row'));
  if (!rows.length) {
    console.debug('[hover-clip] no project rows found');
    return;
  }

  function computeClipForRow(row) {
    const fgs = Array.from(row.querySelectorAll('.clip-fg'));
    if (!fgs.length) return;
    const rect = row.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const centerY = rect.top + rect.height / 2;
    let progress = 1 - (centerY / viewportH);
    progress = Math.min(Math.max(progress, 0), 1);
    const clipPercent = (1 - progress) * 100;
    fgs.forEach(fg => {
      fg.style.setProperty('--clip', clipPercent + '%');
      fg.style.clipPath = `inset(0 ${clipPercent}% 0 0)`;
    });
  }

  const headings = Array.from(document.querySelectorAll('.projects-scroll .project-row h2.project'));
  console.debug('[hover-clip] found project headings', headings.length);
  headings.forEach((heading, idx) => {
    const row = heading.closest('.project-row');
    const fgs = Array.from(heading.querySelectorAll('.clip-fg'));
    if (!fgs.length) return;

    heading.addEventListener('mouseenter', () => {
      console.debug('[hover-clip] heading enter', idx, heading.textContent && heading.textContent.trim());
      fgs.forEach(fg => {
        fg.style.setProperty('--clip', '0%');
        fg.classList.add('hovering');
      });
      heading.classList.add('hovering');
      if (row) row.classList.add('hovering');
    });

    heading.addEventListener('mouseleave', () => {
      console.debug('[hover-clip] heading leave', idx, heading.textContent && heading.textContent.trim());
      fgs.forEach(fg => fg.classList.remove('hovering'));
      heading.classList.remove('hovering');
      if (row) row.classList.remove('hovering');
      computeClipForRow(row);
    });
  });

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

  recomputeAll();
})();
