/* char-reveal.js
   Character-by-character reveal for elements with data-char-reveal attribute.
   Usage: add data-char-reveal to the element you want split (e.g., <p data-char-reveal>Text</p>)
   It will wrap each character in a span.char and add the class .is-visible to start the staggered reveal.
   Respects prefers-reduced-motion.
*/

(function(){
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    console.debug('[char-reveal] prefers-reduced-motion: skipping');
    return; 
  }

  function splitText(node){
    if (node.getAttribute('data-char-split') === 'true') return;
    const text = node.textContent.trim();
    if (!text) return;
    node.innerHTML = '';
    const frag = document.createDocumentFragment();
    for (let i = 0; i < text.length; i++){
      const ch = text[i];
      const span = document.createElement('span');
      span.className = 'char';
      span.setAttribute('aria-hidden','true');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      frag.appendChild(span);
    }
    node.appendChild(frag);
    node.setAttribute('data-char-split','true');
  }

  function revealNode(node){
    const chars = node.querySelectorAll('span.char');
    if (!chars.length) return;
    chars.forEach((c, idx) => {
      c.style.transitionDelay = (idx * 20) + 'ms';
      c.classList.add('is-visible');
    });
    node.setAttribute('data-char-revealed','true');
    console.debug('[char-reveal] revealed', node);
  }

  function init(){
    const els = Array.from(document.querySelectorAll('[data-char-reveal]'));
    if (!els.length) {
      console.debug('[char-reveal] no elements found');
      return;
    }

    els.forEach(el => splitText(el));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!entry.target.getAttribute('data-char-revealed')) revealNode(entry.target);
        }
      });
    }, { threshold: 0 });

    els.forEach(el => io.observe(el));
    console.debug('[char-reveal] initialized for', els.length, 'elements');
  }

  // DOM ready
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { console.debug('[char-reveal] DOM ready'); init(); });
  else { console.debug('[char-reveal] DOM ready (already)'); init(); }
})();
