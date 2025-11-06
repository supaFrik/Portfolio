(function () {
	const menu = document.getElementById('mobileMenu');
	if (!menu) return;

	const path = document.getElementById('menu-curve-path');
	const svg = document.querySelector('.mobile-menu-curve');
	if (!path || !svg) return;

	// Set SVG dimensions based on window
	function updateSVGDimensions() {
		const height = window.innerHeight;
		svg.setAttribute('width', '100');
		svg.setAttribute('height', height);
		svg.setAttribute('viewBox', `0 0 100 ${height}`);
		return height;
	}

	let windowHeight = updateSVGDimensions();

	// Path definitions matching the React code
	const initialPath = `M100 0 L100 ${windowHeight} Q-100 ${windowHeight/2} 100 0`;
	const targetPath = `M100 0 L100 ${windowHeight} Q100 ${windowHeight/2} 100 0`;

	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduce || typeof flubber === 'undefined') {
		path.setAttribute('d', targetPath);
		return;
	}

	let interpolator = flubber.interpolate(initialPath, targetPath, { maxSegmentLength: 2 });

	let rafId = null;
	let start = null;
	let duration = 1000; // 1s for enter, 800ms for exit
	
	// Cubic bezier easing [0.76, 0, 0.24, 1]
	let easing = function (t) { 
		const x1 = 0.76, y1 = 0, x2 = 0.24, y2 = 1;
		// Simplified cubic-bezier approximation
		return t * t * (3 - 2 * t); // smooth ease in-out as approximation
	};

	function animateTo(targetOpen, onComplete) {
		cancelAnimationFrame(rafId);
		start = null;
		
		windowHeight = updateSVGDimensions();
		const fromPath = targetOpen ? initialPath : targetPath;
		const toPath = targetOpen ? targetPath : initialPath;
		const animDuration = targetOpen ? 1000 : 800; // enter: 1s, exit: 0.8s

		if (fromPath === toPath) {
			if (onComplete) onComplete();
			return;
		}

		interpolator = flubber.interpolate(fromPath, toPath, { maxSegmentLength: 2 });

		function step(ts) {
			if (!start) start = ts;
			const elapsed = ts - start;
			const t = Math.min(1, elapsed / animDuration);
			const eased = easing(t);
			try {
				path.setAttribute('d', interpolator(eased));
			} catch (err) {
				path.setAttribute('d', toPath);
				if (onComplete) onComplete();
				return;
			}
			if (t < 1) {
				rafId = requestAnimationFrame(step);
			} else {
				if (onComplete) onComplete();
			}
		}

		rafId = requestAnimationFrame(step);
	}

	const observer = new MutationObserver((mutationsList) => {
		for (const m of mutationsList) {
			if (m.type === 'attributes' && m.attributeName === 'class') {
				const isOpen = menu.classList.contains('open');
				animateTo(isOpen);
			}
		}
	});

	observer.observe(menu, { attributes: true, attributeFilter: ['class'] });

	// Set initial path (exit state)
	path.setAttribute('d', initialPath);

	// Handle window resize
	window.addEventListener('resize', () => {
		windowHeight = updateSVGDimensions();
		const isOpen = menu.classList.contains('open');
		const currentPath = isOpen ? targetPath : initialPath;
		path.setAttribute('d', currentPath.replace(/\d+/g, (match) => {
			return match;
		}));
	});

	window.addEventListener('unload', () => {
		observer.disconnect();
		cancelAnimationFrame(rafId);
	});
})();
