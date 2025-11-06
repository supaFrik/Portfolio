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

    Object.assign(modalContainer.style, {position:'fixed', top:'0px', left:'0px', zIndex:'5000', pointerEvents:'none'});
    Object.assign(hoverCursor.style, {position:'fixed', top:'0px', left:'0px', zIndex:'5001', pointerEvents:'none'});
    Object.assign(hoverCursorLabel.style, {position:'fixed', top:'0px', left:'0px', zIndex:'5002'});

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const modalSetX = gsap.quickSetter(modalContainer, 'x', 'px');
    const modalSetY = gsap.quickSetter(modalContainer, 'y', 'px');
    const cursorSetX = gsap.quickSetter(hoverCursor, 'x', 'px');
    const cursorSetY = gsap.quickSetter(hoverCursor, 'y', 'px');
    const labelSetX = gsap.quickSetter(hoverCursorLabel, 'x', 'px');
    const labelSetY = gsap.quickSetter(hoverCursorLabel, 'y', 'px');

    function getScrollTransformY() {
        const scroller = document.querySelector('#smooth-scroll');
        if (!scroller) return 0;
        const style = window.getComputedStyle(scroller);
        const transform = style.transform || style.webkitTransform;
        if (transform && transform !== 'none') {
            const match = transform.match(/matrix\(([^)]+)\)/);
            if (match) {
                const parts = match[1].split(',');
                const ty = parseFloat(parts[5] || parts[4] || '0');
                return ty;
            }
        }
        return 0;
    }

    const proxy = {x:0, y:0};
    let targetX = 0, targetY = 0;
    const trailDuration = prefersReduced ? 0 : 0.5;
    gsap.ticker.add(() => {
        proxy.x += (targetX - proxy.x) * 0.05;
        proxy.y += (targetY - proxy.y) * 0.02;
        const scrollY = getScrollTransformY();
    const yOffset = 550; 
    modalSetX(proxy.x - 120);
    modalSetY(proxy.y - 100 - scrollY + yOffset);
    cursorSetX(proxy.x - 120);
    cursorSetY(proxy.y - 120 - scrollY + yOffset);
    labelSetX(proxy.x - 120);
    labelSetY(proxy.y - 120 - scrollY + yOffset);
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
        const cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : lastClientX);
        const cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : lastClientY);
        lastClientX = cx; lastClientY = cy;
        // Add scrollY to pointer Y so hover follows the actual document position
        targetX = cx;
        targetY = cy + (window.scrollY || window.pageYOffset);
    }
    window.addEventListener('pointermove', handlePointer, {passive:true});
    window.addEventListener('touchmove', handlePointer, {passive:true});

    window.addEventListener('scroll', () => {
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
