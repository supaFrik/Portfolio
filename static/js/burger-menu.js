(() => {
	const hamburger = document.getElementById('hamburger');
	if (!hamburger) return;

	// find wrapper to hide/show (falls back to the SVG itself)
	const btnWrapper = hamburger.closest('.btn-hamburger') || hamburger;

	hamburger.setAttribute('role', 'button');
	hamburger.setAttribute('aria-label', 'Toggle navigation');
	hamburger.setAttribute('aria-expanded', 'false');
	hamburger.setAttribute('tabindex', '0');

	const toggle = () => {
		const active = hamburger.classList.toggle('is-active');
		hamburger.setAttribute('aria-expanded', active ? 'true' : 'false');

		// toggle mobile menu when hamburger toggles
		if (mobileMenu) {
			// add/remove open class so CSS handles the curve transition
			mobileMenu.classList.toggle('open', active);
			const open = active;
			mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
			document.documentElement.classList.toggle('no-scroll', open);
			// while menu open keep hamburger visible even if hero is in view
			if (open) {
				btnWrapper.classList.remove('fade-hidden');
			} else {
				// re-evaluate visibility based on hero position
				if (hero && ('IntersectionObserver' in window)) {
					// rely on observer to update visibility; do nothing here
				} else if (hero) {
					// immediate check
					const rect = hero.getBoundingClientRect();
					const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
					if (inView) hideBtn(); else showBtn();
				} else showBtn();
			}
		}
	};

	const showBtn = () => {
	 	btnWrapper.classList.remove('fade-hidden');
	 	btnWrapper.style.visibility = '';
	 	hamburger.setAttribute('aria-hidden', 'false');
	};

	const hideBtn = () => {
	 	// Use fade-hidden so CSS transitions handle the visual hide
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

	// Close mobile menu when clicking outside or pressing Escape
	if (mobileMenu) {
		mobileMenu.addEventListener('click', (e) => {
			// close if clicked on the backdrop (not on inner content)
			if (e.target === mobileMenu) {
				// close
					hamburger.classList.remove('is-active');
				hamburger.setAttribute('aria-expanded', 'false');
					mobileMenu.setAttribute('aria-hidden', 'true');
					mobileMenu.classList.remove('open');
				document.documentElement.classList.remove('no-scroll');
				// re-evaluate visibility
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

// Set aria-current on mobile menu links to show active dot
(() => {
	function setActiveMobileLink() {
		const links = document.querySelectorAll('.mobile-menu-link');
		if (!links || links.length === 0) return;

		// Normalize current target: prefer hash if present, else pathname
		const hash = window.location.hash || '';
		const path = window.location.pathname || '';

		links.forEach((a) => {
			// clear existing
			a.removeAttribute('aria-current');
			a.classList.remove('active');

			const href = a.getAttribute('href') || '';

			// Match hash (e.g. #about) or full pathname if links are full URLs
			if (hash && (href === hash || href === (path + hash))) {
				a.setAttribute('aria-current', 'page');
				a.classList.add('active');
			} else if (!hash) {
				// match by pathname (strip origin if present)
				try {
					const url = new URL(href, window.location.origin);
					if (url.pathname === path) {
						a.setAttribute('aria-current', 'page');
						a.classList.add('active');
					}
				} catch (e) {
					// href may be a hash or relative; last resort simple compare
					if (href === path || href === ('.' + path)) {
						a.setAttribute('aria-current', 'page');
						a.classList.add('active');
					}
				}
			}
		});
	}

	// Run on DOM ready and when hash changes
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', setActiveMobileLink);
	} else setActiveMobileLink();

	window.addEventListener('hashchange', setActiveMobileLink);
})();
