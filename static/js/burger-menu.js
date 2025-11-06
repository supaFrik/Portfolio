// Burger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const topLine = document.getElementById('top-line');
  const middleLine = document.getElementById('middle-line');
  const bottomLine = document.getElementById('bottom-line');
  
  let isOpen = false;

  // Toggle menu function
  const toggleMenu = () => {
    isOpen = !isOpen;
    
    // Update ARIA attributes
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    
    if (isOpen) {
      // Open menu
      gsap.to(mobileMenu, {
        right: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
      
      // Animate hamburger to X
      gsap.to(topLine, {
        attr: { d: 'M10,20 L50,20 Z' },
        rotation: 45,
        transformOrigin: 'center',
        duration: 0.3
      });
      
      gsap.to(middleLine, {
        opacity: 0,
        duration: 0.2
      });
      
      gsap.to(bottomLine, {
        attr: { d: 'M10,20 L50,20 Z' },
        rotation: -45,
        transformOrigin: 'center',
        duration: 0.3
      });
    } else {
      // Close menu
      gsap.to(mobileMenu, {
        right: '-140px',
        duration: 0.8,
        ease: 'power3.in'
      });
      
      // Animate X back to hamburger
      gsap.to(topLine, {
        attr: { d: 'M10,10 L50,10 Z' },
        rotation: 0,
        transformOrigin: 'center',
        duration: 0.3
      });
      
      gsap.to(middleLine, {
        opacity: 1,
        duration: 0.2
      });
      
      gsap.to(bottomLine, {
        attr: { d: 'M10,30 L50,30 Z' },
        rotation: 0,
        transformOrigin: 'center',
        duration: 0.3
      });
    }
  };

  // Add click event to hamburger
  hamburger.addEventListener('click', toggleMenu);
  
  // Add keyboard support
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close menu when clicking on menu links
  const menuLinks = document.querySelectorAll('.mobile-menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) {
        toggleMenu();
      }
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      toggleMenu();
    }
  });
});
