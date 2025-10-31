const SCROLL_DURATION_MS = 1600; 

			(function(){
				if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
					return;
				}

				function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

				let active = null; 

				function smoothScrollTo(targetY, duration = SCROLL_DURATION_MS){
					if (typeof targetY !== 'number') return Promise.resolve();
					const startY = window.scrollY || window.pageYOffset;
					const diff = targetY - startY;
					if (!diff) return Promise.resolve();
					let startTime = null;
					let cancelled = false;
					const onUser = () => cancelled = true;
					['wheel','touchstart','keydown'].forEach(ev => window.addEventListener(ev, onUser, {passive:true}));

					return new Promise(resolve => {
						active = function step(ts){
							if (cancelled) {
								['wheel','touchstart','keydown'].forEach(ev => window.removeEventListener(ev, onUser));
								active = null;
								return resolve();
							}
							if (!startTime) startTime = ts;
							const elapsed = ts - startTime;
							const t = Math.min(1, elapsed / duration);
							const v = easeOutCubic(t);
							window.scrollTo(0, Math.round(startY + diff * v));
							if (t < 1) requestAnimationFrame(step);
							else {
								['wheel','touchstart','keydown'].forEach(ev => window.removeEventListener(ev, onUser));
								active = null;
								resolve();
							}
						};
						requestAnimationFrame(active);
					});
				}

				function getTargetYForElement(el){
					const rect = el.getBoundingClientRect();
					return (window.scrollY || window.pageYOffset) + rect.top;
				}

				document.querySelectorAll('a[href^="#"]').forEach(a => {
					a.addEventListener('click', function(e){
						const href = this.getAttribute('href');
						if (!href || href === '#') return;
						const id = href.slice(1);
						const target = document.getElementById(id);
						if (target) {
							e.preventDefault();
							if (active) { active = null; }
							smoothScrollTo(getTargetYForElement(target)).then(() => {
								try { history.pushState(null, '', href); } catch (err) { /* ignore */ }
							});
						}
					});
				});

				if (location.hash) {
					const id = location.hash.slice(1);
					const el = document.getElementById(id);
					if (el) {
						window.scrollTo(0, 0);
						setTimeout(() => smoothScrollTo(getTargetYForElement(el)), 60);
					}
				}
			})();