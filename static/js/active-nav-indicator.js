// Active Navigation Indicator
// Updates navigation links based on current scroll position

(function() {
    'use strict';

    // Get all navigation links (both desktop and mobile)
    const desktopNavLinks = document.querySelectorAll('header nav a[href^="#"]');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-link[href^="#"]');
    const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

    // Get all sections that have IDs
    const sections = [];
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#') {
            // Home link - use the hero section or first section
            sections.push({
                id: 'home',
                element: document.querySelector('.rail') || document.body,
                links: allNavLinks.filter(l => l.getAttribute('href') === '#')
            });
        } else {
            const sectionId = href.substring(1);
            const section = document.getElementById(sectionId);
            if (section) {
                sections.push({
                    id: sectionId,
                    element: section,
                    links: allNavLinks.filter(l => l.getAttribute('href') === href)
                });
            }
        }
    });

    // Remove duplicates from sections array
    const uniqueSections = sections.filter((section, index, self) =>
        index === self.findIndex(s => s.id === section.id)
    );

    function updateActiveNav() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        let currentSection = uniqueSections[0]; // Default to first section (home)

        // Find the current section based on scroll position
        for (let i = uniqueSections.length - 1; i >= 0; i--) {
            const section = uniqueSections[i];
            const sectionTop = section.element.offsetTop;
            
            if (scrollPosition >= sectionTop) {
                currentSection = section;
                break;
            }
        }

        // Update active class on all nav links
        allNavLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current section's links
        if (currentSection && currentSection.links) {
            currentSection.links.forEach(link => {
                link.classList.add('active');
            });
        }
    }

    // Update on scroll with throttling for performance
    let scrollTimeout;
    function handleScroll() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            updateActiveNav();
        });
    }

    // Initial update
    updateActiveNav();

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Update on resize (in case section positions change)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateActiveNav, 150);
    }, { passive: true });

    // Update when smooth scroll completes
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(updateActiveNav, 600); // Wait for smooth scroll to complete
        });
    });

})();
