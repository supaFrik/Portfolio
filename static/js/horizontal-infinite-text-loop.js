(function() {
  const marqueeTrack = document.querySelector('.infinite-text-loop');
  if (!marqueeTrack) return;

  const originalHTML = marqueeTrack.innerHTML;
  marqueeTrack.innerHTML += originalHTML;

  let direction = 1;
  let lastScrollY = window.scrollY;
  let pos = 0;
  const speed = 0.8; 

  function animate() {
    pos += speed * direction;
    if (pos <= -marqueeTrack.scrollWidth / 2) pos = 0;
    if (pos >= 0) pos = -marqueeTrack.scrollWidth / 2;
    marqueeTrack.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(animate);
  }

  window.addEventListener('scroll', function() {
    const currentY = window.scrollY;
    if (currentY > lastScrollY) {
      direction = 1;
    } else if (currentY < lastScrollY) {
      direction = -1; 
    }
    lastScrollY = currentY;
  });

  marqueeTrack.style.display = 'inline-block';
  marqueeTrack.parentElement.style.overflow = 'hidden';
  marqueeTrack.parentElement.style.whiteSpace = 'nowrap';

  animate();
})();
