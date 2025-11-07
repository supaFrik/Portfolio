(function() {
    'use strict';

    const desktopNavLinks = document.querySelectorAll('header nav a[href^="#"]');
    const mobileNavLinks = document.querySelectorAll('.mobile-menu-link[href^="#"]');
    const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

    const sections = [];
    allNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === '#') {
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

    const uniqueSections = sections.filter((section, index, self) =>
        index === self.findIndex(s => s.id === section.id)
    );

    function updateActiveNav() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;

        let currentSection = uniqueSections[0]; 

        for (let i = uniqueSections.length - 1; i >= 0; i--) {
            const section = uniqueSections[i];
            const sectionTop = section.element.offsetTop;
            
            if (scrollPosition >= sectionTop) {
                currentSection = section;
                break;
            }
        }

        allNavLinks.forEach(link => {
            link.classList.remove('active');
        });

        if (currentSection && currentSection.links) {
            currentSection.links.forEach(link => {
                link.classList.add('active');
            });
        }
    }

    let scrollTimeout;
    function handleScroll() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            updateActiveNav();
        });
    }

    updateActiveNav();

    window.addEventListener('scroll', handleScroll, { passive: true });

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateActiveNav, 150);
    }, { passive: true });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(updateActiveNav, 600); 
        });
    });

})();
