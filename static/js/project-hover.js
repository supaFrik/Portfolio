(function(){
    if(!window.gsap) return;

    const projects = Array.from(document.querySelectorAll('.project-card'));
    if(!projects.length) return;

    const modalContainer = document.getElementById('modalContainer');
    const modalSlider = document.getElementById('modalSlider');
    const hoverCursor = document.getElementById('hoverCursor');
    const hoverCursorLabel = document.getElementById('hoverCursorLabel');

    projects.forEach((el, i) => {
        let src = el.getAttribute('data-src') || '';
        const color = el.getAttribute('data-color') || '#fff';

        if (src && !src.match(/^(https?:)?\/\//) && !src.startsWith('/') ){
            if (!src.includes('./') && !src.startsWith('static/') && !src.startsWith('img/') && !src.includes('/')){
                src = `./static/img/${src}`;
            }
        }
        if (src) src = src.split(' ').map(encodeURIComponent).join('%20');

        const slide = document.createElement('div');
        slide.className = 'modal';
        slide.style.backgroundColor = color;
        const img = document.createElement('img');
        img.src = src || '';
        img.alt = el.textContent.trim() || `project-${i}`;
        slide.appendChild(img);
        modalSlider.appendChild(slide);
    });

    const moveLeft = gsap.quickTo(modalContainer, 'left', {duration: 0.6, ease: 'power3'});
    const moveTop = gsap.quickTo(modalContainer, 'top', {duration: 0.6, ease: 'power3'});
    const moveCursorLeft = gsap.quickTo(hoverCursor, 'left', {duration: 0.45, ease: 'power3'});
    const moveCursorTop = gsap.quickTo(hoverCursor, 'top', {duration: 0.45, ease: 'power3'});
    const moveLabelLeft = gsap.quickTo(hoverCursorLabel, 'left', {duration: 0.4, ease: 'power3'});
    const moveLabelTop = gsap.quickTo(hoverCursorLabel, 'top', {duration: 0.4, ease: 'power3'});

    function showModal(){
        modalContainer.style.display = 'flex';
        hoverCursor.style.display = 'flex';
        hoverCursorLabel.style.display = 'flex';
        gsap.to([modalContainer, hoverCursor, hoverCursorLabel], {scale:1, duration:0.35, ease: 'power3.out'});
    }
    function hideModal(){
        gsap.to([modalContainer, hoverCursor, hoverCursorLabel], {scale:0, duration:0.28, ease: 'power3.in', onComplete: ()=>{
            modalContainer.style.display = 'none';
            hoverCursor.style.display = 'none';
            hoverCursorLabel.style.display = 'none';
        }});
    }

    gsap.set([modalContainer, hoverCursor, hoverCursorLabel], {scale:0});
    modalContainer.style.display = 'none';
    hoverCursor.style.display = 'none';
    hoverCursorLabel.style.display = 'none';

    window.addEventListener('mousemove', (e) => {
        const x = e.pageX - 40; 
        const y = e.pageY - 40;
        moveLeft(x);
        moveTop(y);
        moveCursorLeft(x);
        moveCursorTop(y);
        moveLabelLeft(x);
        moveLabelTop(y);
    });

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
        el.addEventListener('click', (ev) => {
            const link = el.getAttribute('data-link');
            if (!link) return;
            window.open(link, '_blank', 'noopener,noreferrer');
        });
        el.setAttribute('tabindex', el.getAttribute('tabindex') || '0');
        el.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter' || ev.key === ' ') {
                ev.preventDefault();
                const link = el.getAttribute('data-link');
                if (link) window.open(link, '_blank', 'noopener,noreferrer');
            }
        });
    });

    if (hoverCursorLabel) {
        hoverCursorLabel.style.cursor = 'pointer';
        hoverCursorLabel.addEventListener('click', (e) => {
            if (!currentProjectLink) return;
            window.open(currentProjectLink, '_blank', 'noopener,noreferrer');
        });
    }

})();
