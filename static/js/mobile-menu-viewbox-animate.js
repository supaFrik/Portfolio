(function () {
    'use strict';

    function parseViewBox(vb) {
        if (!vb) return null;
        return vb.trim().split(/\s+/).map(Number);
    }

    function viewBoxToString(arr) {
        return arr.map(n => Math.round(n * 1000) / 1000).join(' ');
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animateViewBox(svg, from, to, opts) {
        opts = opts || {};
        var duration = opts.duration || 600; // ms
        var easing = opts.easing || easeInOutCubic;
        var start = null;

        function step(ts) {
            if (start === null) start = ts;
            var elapsed = ts - start;
            var t = Math.min(1, elapsed / duration);
            var eased = easing(t);

            var cur = from.map(function (f, i) {
                return f + (to[i] - f) * eased;
            });

            svg.setAttribute('viewBox', viewBoxToString(cur));

            if (t < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function init() {
        var svg = document.getElementById('mobileMenuCurve');
        if (!svg) return;

        var initial = parseViewBox(svg.getAttribute('viewBox')) || [0, 0, 400, 100];
        var target = [0, 0, 200, 100];

        if (initial[2] <= target[2]) return;

        window.setTimeout(function () {
            animateViewBox(svg, initial, target, { duration: 700 });
        }, 120);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
