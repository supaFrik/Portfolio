// Infinite marquee text loop with direction change on scroll
(function() {
  const marqueeTrack = document.querySelector('.marquee-track');
  if (!marqueeTrack) return;

  // Duplicate content for seamless loop
  const originalHTML = marqueeTrack.innerHTML;
  marqueeTrack.innerHTML += originalHTML;

  let direction = 1; // 1 = left, -1 = right
  let lastScrollY = window.scrollY;
  let pos = 0;
  const speed = 0.5; // Adjust for desired speed

  function animate() {
    pos += speed * direction;
    // Reset position for seamless loop
    if (pos <= -marqueeTrack.scrollWidth / 2) pos = 0;
    if (pos >= 0) pos = -marqueeTrack.scrollWidth / 2;
    marqueeTrack.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(animate);
  }

  // Scroll direction detection
  window.addEventListener('scroll', function() {
    const currentY = window.scrollY;
    if (currentY > lastScrollY) {
      direction = 1; // Scroll down: left
    } else if (currentY < lastScrollY) {
      direction = -1; // Scroll up: right
    }
    lastScrollY = currentY;
  });

  // Set marqueeTrack to inline-block for proper width
  marqueeTrack.style.display = 'inline-block';
  marqueeTrack.parentElement.style.overflow = 'hidden';
  marqueeTrack.parentElement.style.whiteSpace = 'nowrap';

  animate();
})();
