(function(){
    // Abort early if GSAP isn't present.
    if(!window.gsap){
        console.warn('[project-hover] GSAP not found on window – effect disabled.');
        return;
    }

    const projects = Array.from(document.querySelectorAll('.project-card'));
    if(!projects.length){
        console.warn('[project-hover] No elements with .project-card found.');
        return;
    }

    const modalContainer = document.getElementById('modalContainer');
    const modalSlider = document.getElementById('modalSlider');
    const hoverCursor = document.getElementById('hoverCursor');
    const hoverCursorLabel = document.getElementById('hoverCursorLabel');

    if(!modalContainer || !modalSlider || !hoverCursor || !hoverCursorLabel){
        console.warn('[project-hover] One or more required DOM nodes are missing (modalContainer/modalSlider/hoverCursor/hoverCursorLabel).');
        return;
    }

    // If parent section is hidden (e.g. Tailwind `hidden lg:block` on small screens) surface a hint.
    if(getComputedStyle(modalContainer.parentElement).display === 'none'){
        console.info('[project-hover] Hover modal root is currently display:none (likely due to responsive classes). Hover effect will be invisible on this breakpoint.');
    }

    // Build slides from project cards.
    projects.forEach((el, i) => {
        let src = el.getAttribute('data-src') || '';
        const color = el.getAttribute('data-color') || '#fff';

        // Basic relative path inference if a bare filename was provided.
        if (src && !/^(https?:)?\/\//.test(src) && !src.startsWith('/')) {
            const hasPathParts = src.includes('/') || src.startsWith('static/') || src.startsWith('img/');
            if(!hasPathParts){
                src = `./static/img/${src}`;
            }
        }
        // Encode spaces safely (keep extension intact).
        if (src) src = src.split(' ').map(encodeURIComponent).join('%20');

        const slide = document.createElement('div');
        slide.className = 'modal';
        slide.style.backgroundColor = color;
        const img = document.createElement('img');
        img.src = src || '';
        img.alt = el.textContent.trim() || `project-${i+1}`;
        slide.appendChild(img);
        modalSlider.appendChild(slide);
    });

    // Ensure fixed positioning so elements don't shift relative to scroll.
    // (If your CSS already sets this, these are harmless overrides.)
    Object.assign(modalContainer.style, {position:'fixed', top:'0px', left:'0px', zIndex:'5000', pointerEvents:'none'});
    Object.assign(hoverCursor.style, {position:'fixed', top:'0px', left:'0px', zIndex:'5001', pointerEvents:'none'});
    Object.assign(hoverCursorLabel.style, {position:'fixed', top:'0px', left:'0px', zIndex:'5002'});

    // Performance: use transform setters instead of layout-affecting left/top.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const modalSetX = gsap.quickSetter(modalContainer, 'x', 'px');
    const modalSetY = gsap.quickSetter(modalContainer, 'y', 'px');
    const cursorSetX = gsap.quickSetter(hoverCursor, 'x', 'px');
    const cursorSetY = gsap.quickSetter(hoverCursor, 'y', 'px');
    const labelSetX = gsap.quickSetter(hoverCursorLabel, 'x', 'px');
    const labelSetY = gsap.quickSetter(hoverCursorLabel, 'y', 'px');

    // Smooth trailing effect using a proxy object animated by GSAP.
    const proxy = {x:0, y:0};
    let targetX = 0, targetY = 0;
    const trailDuration = prefersReduced ? 0 : 0.5;
    gsap.ticker.add(() => {
        // Ease towards target manually for fine-grain control (alternative to gsap.to each move).
        proxy.x += (targetX - proxy.x) * 0.18; // smoothing factor
        proxy.y += (targetY - proxy.y) * 0.18;
        modalSetX(proxy.x - 40);
        modalSetY(proxy.y - 40);
        cursorSetX(proxy.x - 40);
        cursorSetY(proxy.y - 40);
        labelSetX(proxy.x - 40);
        labelSetY(proxy.y - 40);
    });

    function showModal(){
        modalContainer.style.display = 'flex';
        hoverCursor.style.display = 'flex';
        hoverCursorLabel.style.display = 'flex';
        modalContainer.setAttribute('aria-hidden', 'false');
        gsap.to([modalContainer, hoverCursor, hoverCursorLabel], {scale:1, duration:0.35, ease: 'power3.out'});
    }
    function hideModal(){
        gsap.to([modalContainer, hoverCursor, hoverCursorLabel], {scale:0, duration:0.28, ease: 'power3.in', onComplete: ()=>{
            modalContainer.style.display = 'none';
            hoverCursor.style.display = 'none';
            hoverCursorLabel.style.display = 'none';
            modalContainer.setAttribute('aria-hidden', 'true');
        }});
    }

    gsap.set([modalContainer, hoverCursor, hoverCursorLabel], {scale:0});
    modalContainer.style.display = 'none';
    hoverCursor.style.display = 'none';
    hoverCursorLabel.style.display = 'none';
    modalContainer.setAttribute('aria-hidden', 'true');

    let lastClientX = 0, lastClientY = 0;
    function handlePointer(e){
        // For touch events, clientX/Y exist on the first touch.
        const cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : lastClientX);
        const cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : lastClientY);
        lastClientX = cx; lastClientY = cy;
        targetX = cx;
        targetY = cy;
    }
    window.addEventListener('pointermove', handlePointer, {passive:true});
    window.addEventListener('touchmove', handlePointer, {passive:true});

    // Re-sync on scroll to avoid drift if any scroll-based transform affects layout.
    window.addEventListener('scroll', () => {
        // Force target to last known pointer position so smoothing continues from correct spot.
        targetX = lastClientX;
        targetY = lastClientY;
    }, {passive:true});

    let hideTimer = null;
    const HIDE_DELAY = 180; 
    let isVisible = false;
    let currentProjectLink = null;

    function scheduleHide(){
        if(hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => {
            hideModal();
            isVisible = false;
            hideTimer = null;
        }, HIDE_DELAY);
    }

    function cancelHide(){
        if(hideTimer){
            clearTimeout(hideTimer);
            hideTimer = null;
        }
    }

    projects.forEach((el, i) => {
        el.addEventListener('mouseenter', () => {
            cancelHide();
            if(!isVisible){
                showModal();
                isVisible = true;
            }
            modalSlider.style.top = `${i * -100}%`;
            currentProjectLink = el.getAttribute('data-link') || null;
        });
        el.addEventListener('mouseleave', () => {
            scheduleHide();
            currentProjectLink = null;
        });
        el.style.cursor = 'pointer';

        const isAnchor = el.tagName && el.tagName.toLowerCase() === 'a';
        if (!isAnchor) {
            el.setAttribute('tabindex', el.getAttribute('tabindex') || '0');
            el.addEventListener('click', () => {
                const link = el.getAttribute('data-link');
                if (!link) return;
                window.open(link, '_blank', 'noopener,noreferrer');
            });
            el.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault();
                    const link = el.getAttribute('data-link');
                    if (link) window.open(link, '_blank', 'noopener,noreferrer');
                }
            });
        } else if (!el.hasAttribute('aria-label')) {
            try {
                const titleEl = el.querySelector('h2, h3');
                const titleText = titleEl ? titleEl.textContent.trim() : `project ${i + 1}`;
                el.setAttribute('aria-label', `Open ${titleText} in a new tab`);
            } catch (err) {
            }
        }
    });

    if (hoverCursorLabel) {
        hoverCursorLabel.style.cursor = 'pointer';
        hoverCursorLabel.addEventListener('click', () => {
            if (!currentProjectLink) return;
            window.open(currentProjectLink, '_blank', 'noopener,noreferrer');
        });
    }
})();
