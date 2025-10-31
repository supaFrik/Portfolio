(function(){
    if(!window.gsap) return;

    const projects = Array.from(document.querySelectorAll('.project-card'));
    if(!projects.length) return;

    const modalContainer = document.getElementById('modalContainer');
    const modalSlider = document.getElementById('modalSlider');
    const hoverCursor = document.getElementById('hoverCursor');
    const hoverCursorLabel = document.getElementById('hoverCursorLabel');

    projects.forEach((el, i) => {
        const src = el.getAttribute('data-src') || '';
        const color = el.getAttribute('data-color') || '#fff';

        const slide = document.createElement('div');
        slide.className = 'modal';
        slide.style.backgroundColor = color;
        const img = document.createElement('img');
        img.src = src ? `./images/${src}` : '';
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
        });
        el.addEventListener('mouseleave', () => {
            scheduleHide();
        });
    });

})();
