/* swirl.js — "Liquid Chrome / Swirl" animated background (from the supplied Background ZIP: index.html + style.css + swirl.js).
   The artwork (SVG paths, gradients, turbulence filter), the CSS keyframes and the per-frame animation maths are the originals.
   Changes needed only to live inside the Event Booking page:
     • element ids / class names are prefixed with "swirl-" so nothing can clash with the site;
     • the layer is mounted inside the Home hero (absolute, behind the content) instead of covering the whole window;
     • the loop pauses while the hero is off-screen or the tab is hidden, and is static for prefers-reduced-motion. */
(function () {
  'use strict';

  var MARKUP = '<div class="swirl-bg" aria-hidden="true"><svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false"><defs><linearGradient id="swirl-chrome" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0a0a0a"/><stop offset="12%" stop-color="#BA1F8F"/><stop offset="23%" stop-color="#FFB5DF"/><stop offset="32%" stop-color="#FF4A9E"/><stop offset="43%" stop-color="#520A43"/><stop offset="52%" stop-color="#FFFFFF"/><stop offset="62%" stop-color="#BA1F8F"/><stop offset="75%" stop-color="#FF4A9E"/><stop offset="90%" stop-color="#35062D"/><stop offset="100%" stop-color="#0a0a0a"/></linearGradient><filter id="swirl-liquid"><feTurbulence id="swirl-turbulence" type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="8"/><feDisplacementMap id="swirl-displacement" in="SourceGraphic" scale="65"/></filter><radialGradient id="swirl-shine"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="25%" stop-color="#FFB5DF"/><stop offset="60%" stop-color="#FF4A9E"/><stop offset="100%" stop-color="#BA1F8F"/></radialGradient></defs><g id="swirl-shapes" filter="url(#swirl-liquid)"><path class="swirl-metal swirl-metal-one" d="M-100 350 C100 100 300 100 500 300 S850 650 1050 350 S1350 100 1600 400 L1600 1000 L-100 1000 Z" fill="url(#swirl-chrome)"/><path class="swirl-metal swirl-metal-two" d="M-150 650 C100 400 350 450 550 600 S900 850 1100 550 S1400 350 1600 600" fill="none" stroke="url(#swirl-shine)" stroke-width="120"/><path class="swirl-metal swirl-metal-three" d="M-100 200 C250 450 400 50 700 250 S1100 550 1500 150" fill="none" stroke="url(#swirl-chrome)" stroke-width="75"/></g></svg></div>';

  var live = null;

  function stop() {
    if (!live) return;
    live.running = false;
    if (live.raf) cancelAnimationFrame(live.raf);
    if (live.io) live.io.disconnect();
    window.removeEventListener('pointermove', live.onMove);
    document.removeEventListener('visibilitychange', live.onVis);
    live = null;
  }

  function start(root) {
    stop();
    if (!root) return;
    var turbulence = root.querySelector('#swirl-turbulence');
    var displacement = root.querySelector('#swirl-displacement');
    var shapes = root.querySelectorAll('.swirl-metal');
    if (!turbulence || !displacement) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* original settings: very light distortion so the shapes stay precise */
    var frequencyX = 0.002;
    var frequencyY = 0.002;
    turbulence.setAttribute('baseFrequency', frequencyX + ' ' + frequencyY);
    turbulence.setAttribute('numOctaves', '1');
    displacement.setAttribute('scale', '3');
    if (reduce) return;

    var time = 0;
    var mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    var st = { running: true, raf: 0, io: null };
    live = st;

    st.onMove = function (e) {
      mouse.targetX = (e.clientX / innerWidth - 0.5) * 12;
      mouse.targetY = (e.clientY / innerHeight - 0.5) * 12;
    };
    window.addEventListener('pointermove', st.onMove);

    function animate() {
      if (!st.running) return;
      time += 0.008;

      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      shapes.forEach(function (shape, index) {
        var speed = time * (0.35 + index * 0.12);
        var x = Math.sin(speed + index) * 12 + mouse.x;
        var y = Math.cos(speed * 0.8 + index) * 8 + mouse.y;
        var rotation = Math.sin(speed) * 2;
        shape.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(' + rotation + 'deg)';
      });

      st.raf = requestAnimationFrame(animate);
    }

    function setActive(on) {
      if (on === st.running) return;
      st.running = on;
      root.classList.toggle('is-paused', !on);
      if (on) st.raf = requestAnimationFrame(animate); else if (st.raf) cancelAnimationFrame(st.raf);
    }
    st.onVis = function () { setActive(!document.hidden && st.visible !== false); };
    document.addEventListener('visibilitychange', st.onVis);
    if ('IntersectionObserver' in window) {
      st.io = new IntersectionObserver(function (entries) {
        st.visible = entries[entries.length - 1].isIntersecting;
        setActive(st.visible && !document.hidden);
      });
      st.io.observe(root);
    }

    animate();
  }

  window.Swirl = { markup: MARKUP, start: start, stop: stop };
})();
