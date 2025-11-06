	if (window.gsap && window.ScrollTrigger) {
				gsap.registerPlugin(ScrollTrigger);
				const heading = document.querySelector('.about-heading');
				if (heading) {
					const text = heading.textContent.trim();
					const words = text.split(/\s+/).map(w => {
						const span = document.createElement('span');
						// add about-word plus Tailwind spacing utility
						span.className = 'about-word inline-block mr-1';
						span.textContent = w.replace(/\s+$/,'');
						return span;
					});
					heading.textContent = '';
					words.forEach((s, i) => {
						heading.appendChild(s);
						if (i < words.length - 1) heading.appendChild(document.createTextNode(' '));
					});

					gsap.fromTo('.about-word',
						{ y: 18, opacity: 0 },
						{
							y: 0,
							opacity: 1,
							duration: 0.65,
							stagger: 0.04,
							ease: 'power3.out',
							scrollTrigger: {
								trigger: heading,
								start: 'top 80%'
							}
						}
					);
				}
			}