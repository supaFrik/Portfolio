(function(){
    const root = document.getElementById('floatGalleryRoot');
    if(!root) return;

    const plane1 = root.querySelector('.plane-1');
    const plane2 = root.querySelector('.plane-2');
    const plane3 = root.querySelector('.plane-3');

    let requestId = null;
    let xForce = 0;
    let yForce = 0;
    const easing = 0.08;
    const speed = 0.01;

    function lerp(start, target, amount){
        return start * (1 - amount) + target * amount;
    }

    function animate(){
        xForce = lerp(xForce, 0, easing);
        yForce = lerp(yForce, 0, easing);

        if(plane1) gsap.set(plane1, {x: `+=${xForce}`, y: `+=${yForce}`});
        if(plane2) gsap.set(plane2, {x: `+=${xForce * 0.5}`, y: `+=${yForce * 0.5}`});
        if(plane3) gsap.set(plane3, {x: `+=${xForce * 0.25}`, y: `+=${yForce * 0.25}`});

        if(Math.abs(xForce) < 0.01) xForce = 0;
        if(Math.abs(yForce) < 0.01) yForce = 0;

        if(xForce !== 0 || yForce !== 0){
            requestId = requestAnimationFrame(animate);
        } else {
            cancelAnimationFrame(requestId);
            requestId = null;
        }
    }

    function onMove(e){
        const movementX = e.movementX ?? (e.mozMovementX || 0);
        const movementY = e.movementY ?? (e.mozMovementY || 0);
        xForce += movementX * speed;
        yForce += movementY * speed;

        if(requestId == null){
            requestId = requestAnimationFrame(animate);
        }
    }

    // Listen on the gallery section so it doesn't interfere with the page
    const section = document.getElementById('float-gallery');
    if(section){
        section.addEventListener('mousemove', onMove);
        section.addEventListener('touchmove', function(ev){
            // approximate using touch delta
            const t = ev.touches && ev.touches[0];
            if(t && section._lastTouch){
                const dx = t.clientX - section._lastTouch.x;
                const dy = t.clientY - section._lastTouch.y;
                xForce += dx * speed;
                yForce += dy * speed;
                if(requestId == null) requestId = requestAnimationFrame(animate);
            }
            section._lastTouch = { x: t.clientX, y: t.clientY };
        }, { passive: true });
    }
})();
