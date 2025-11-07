(() => {
	const hamburger = document.getElementById('hamburger');
	if (!hamburger) return;

	const btnWrapper = hamburger.closest('.btn-hamburger') || hamburger;

	hamburger.setAttribute('role', 'button');
	hamburger.setAttribute('aria-label', 'Toggle navigation');
	hamburger.setAttribute('aria-expanded', 'false');
	hamburger.setAttribute('tabindex', '0');

	const toggle = () => {
		const active = hamburger.classList.toggle('is-active');
        btnWrapper.classList.toggle('active', active);
		hamburger.setAttribute('aria-expanded', active ? 'true' : 'false');

		if (mobileMenu) {
			mobileMenu.classList.toggle('open', active);
			const open = active;
			mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
			document.documentElement.classList.toggle('no-scroll', open);
			if (open) {
				btnWrapper.classList.remove('fade-hidden');
			} else {
				if (hero && ('IntersectionObserver' in window)) {
				} else if (hero) {
					const rect = hero.getBoundingClientRect();
					const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
					if (inView) hideBtn(); else showBtn();
				} else showBtn();
			}
		}

        // Animate slide up with GSAP if available
        if (window.gsap && active) {
            window.gsap.fromTo(
                btnWrapper,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
            );
        }
	};

	const showBtn = () => {
	 	btnWrapper.classList.remove('fade-hidden');
	 	btnWrapper.style.visibility = '';
	 	hamburger.setAttribute('aria-hidden', 'false');
	};

	const hideBtn = () => {
	 	btnWrapper.classList.add('fade-hidden');
	 	hamburger.setAttribute('aria-hidden', 'true');
	};

	const hero = document.querySelector('.rail');
	const mobileMenu = document.getElementById('mobileMenu');
	if (hero) {
		if ('IntersectionObserver' in window) {
			const io = new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						hideBtn();
					} else {
						showBtn();
					}
				});
			}, { threshold: 0.01 });

			io.observe(hero);
		} else {
			const checkHero = () => {
				const rect = hero.getBoundingClientRect();
				const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
				if (inView) hideBtn(); else showBtn();
			};

			checkHero();
			window.addEventListener('scroll', checkHero, { passive: true });
			window.addEventListener('resize', checkHero);
		}
	} else {
		showBtn();
	}

	hamburger.addEventListener('click', toggle);
	hamburger.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggle();
		}
	});

	if (mobileMenu) {
		mobileMenu.addEventListener('click', (e) => {
			if (e.target === mobileMenu) {
					hamburger.classList.remove('is-active');
				hamburger.setAttribute('aria-expanded', 'false');
					mobileMenu.setAttribute('aria-hidden', 'true');
					mobileMenu.classList.remove('open');
				document.documentElement.classList.remove('no-scroll');
				if (hero) {
					const rect = hero.getBoundingClientRect();
					const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
					if (inView) hideBtn();
				}
			}
		});

		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && mobileMenu.getAttribute('aria-hidden') === 'false') {
				hamburger.classList.remove('is-active');
				hamburger.setAttribute('aria-expanded', 'false');
					mobileMenu.setAttribute('aria-hidden', 'true');
					mobileMenu.classList.remove('open');
				document.documentElement.classList.remove('no-scroll');
				if (hero) {
					const rect = hero.getBoundingClientRect();
					const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
					if (inView) hideBtn();
				}
			}
		});
	}
})();

(() => {
	function setActiveMobileLink() {
		const links = document.querySelectorAll('.mobile-menu-link');
		if (!links || links.length === 0) return;

		const hash = window.location.hash || '';
		const path = window.location.pathname || '';

		links.forEach((a) => {
			a.removeAttribute('aria-current');
			a.classList.remove('active');

			const href = a.getAttribute('href') || '';

			if (hash && (href === hash || href === (path + hash))) {
				a.setAttribute('aria-current', 'page');
				a.classList.add('active');
			} else if (!hash) {
				try {
					const url = new URL(href, window.location.origin);
					if (url.pathname === path) {
						a.setAttribute('aria-current', 'page');
						a.classList.add('active');
					}
				} catch (e) {
					if (href === path || href === ('.' + path)) {
						a.setAttribute('aria-current', 'page');
						a.classList.add('active');
					}
				}
			}
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setActiveMobileLink);
	} else setActiveMobileLink();

	window.addEventListener('hashchange', setActiveMobileLink);
})();
