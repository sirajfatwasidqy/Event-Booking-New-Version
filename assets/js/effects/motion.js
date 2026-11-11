/* =====================================================================
   motion.js — animation layer for Event Booking (PT Duta Abadi Primantara)

   Purely additive: it does not touch the application's state, routing or
   rendering code. It only
     • injects a fixed animated background behind the page,
     • watches the DOM the app already renders (MutationObserver) and adds /
       removes temporary animation classes,
     • animates modal exit, header scroll state and the scroll-progress bar.
   Every class it adds is removed again when its animation ends, so the
   original markup and styling are left exactly as they were.
   ===================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  if (reduce) document.documentElement.classList.add('fx-reduce');

  /* ------------------------------------------------------------------
     1. Animated background: soft drifting light + a faint particle field
     ------------------------------------------------------------------ */
  function buildBackground() {
    var bg = document.createElement('div');
    bg.className = 'fx-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML = '<div class="fx-par"><div class="fx-sheen"></div>' +
      '<div class="fx-orb o1"></div><div class="fx-orb o2"></div><div class="fx-orb o3"></div><div class="fx-orb o4"></div></div>' +
      '<canvas class="fx-cv"></canvas>';
    document.body.insertBefore(bg, document.body.firstChild);

    /* multi-page: carry the drift animation on from the previous page instead of restarting it */
    var fxEl = window.__fxElapsed || 0;
    if (fxEl > 0 && !reduce) $$('.fx-orb, .fx-sheen', bg).forEach(function (n) { n.style.animationDelay = (-fxEl).toFixed(2) + 's'; });

    var par = $('.fx-par', bg);
    var cv = $('.fx-cv', bg);
    if (reduce || !cv.getContext) return;

    /* gentle pointer parallax on the light layer (desktop only) */
    if (fine) {
      var tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
      var loop = function () {
        cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
        par.style.translate = cx.toFixed(2) + 'px ' + cy.toFixed(2) + 'px';
        raf = (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) ? requestAnimationFrame(loop) : 0;
      };
      window.addEventListener('pointermove', function (e) {
        tx = (e.clientX / window.innerWidth - 0.5) * -34;
        ty = (e.clientY / window.innerHeight - 0.5) * -34;
        if (!raf) raf = requestAnimationFrame(loop);
      }, { passive: true });
    }

    /* particle field */
    var ctx = cv.getContext('2d');
    var W = 0, H = 0, dpr = 1, parts = [], running = false, last = 0;
    var LINK = 140;

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.max(18, Math.min(54, Math.round(W * H / 26000)));
      while (parts.length < n) parts.push(spawn());
      parts.length = n;
    }
    function spawn() {
      var a = Math.random() * Math.PI * 2, v = 5 + Math.random() * 9;
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        r: 1 + Math.random() * 1.8,
        a: 0.16 + Math.random() * 0.26,
        t: Math.random() * 6.28, ts: 0.3 + Math.random() * 0.7,
        pink: Math.random() < 0.38
      };
    }
    function frame(now) {
      if (!running) return;
      var dt = Math.min((now - last) / 1000, 0.05); last = now;
      ctx.clearRect(0, 0, W, H);
      var i, j, p, q, dx, dy, d, al;
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        p.x += p.vx * dt; p.y += p.vy * dt; p.t += p.ts * dt;
        if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
      }
      ctx.lineWidth = 1;
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        for (j = i + 1; j < parts.length; j++) {
          q = parts[j]; dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            al = (1 - Math.sqrt(d) / LINK) * 0.13;
            ctx.strokeStyle = 'rgba(100,30,53,' + al.toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < parts.length; i++) {
        p = parts[i];
        al = p.a * (0.65 + 0.35 * Math.sin(p.t));
        ctx.fillStyle = p.pink ? 'rgba(196,96,132,' + al.toFixed(3) + ')' : 'rgba(100,30,53,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(frame); }
    function stop() { running = false; }

    size();
    var rt = 0;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    start();
  }

  /* ------------------------------------------------------------------
     2. Header: scroll shadow + reading-progress line
     ------------------------------------------------------------------ */
  function headerScroll() {
    var hdr = $('#hdr'); if (!hdr) return;
    var tick = false;
    function update() {
      tick = false;
      var y = window.pageYOffset || 0;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      hdr.classList.toggle('fx-scrolled', y > 8);
      hdr.style.setProperty('--fx-p', Math.min(1, y / max).toFixed(4));
    }
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ------------------------------------------------------------------
     3. Reveal engine (route entrance + scroll reveal + in-page updates)
     ------------------------------------------------------------------ */
  var SEL = [
    '.page-h', '.crumbs', '.sec-h', '.hero .tag', '.hero h1', '.hero p.lead', '.hero .search-xl', '.feat',
    '.banner-cta', '.toolbar', '.card', '.detail-banner', '.detail h1', '.chips', '.sched > div', '.hl > div',
    '.sess', '.steps', '.succ', '.ticket', '.prof', '.side', '.shield', '.tabs', '.grp', '.nt',
    '.auth-l > *', '.auth-box', '.empty', '.callout', '.req', '.terms', '.scanner', '.pager', '.gal',
    '.thumbs', '.act-list', '.menu-list', '.qr-row', '.dl-split > *', '.ev-row', '.ev-card', '.pcard',
    '.tk', '.bk', '.acts', '.kv', '.bcimg'
  ].join(',');

  var io = null;
  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver(function (entries) {
      var vis = entries.filter(function (e) { return e.isIntersecting; });
      if (!vis.length) return;
      vis.sort(function (a, b) {
        var ra = a.boundingClientRect, rb = b.boundingClientRect;
        return (Math.round(ra.top / 40) - Math.round(rb.top / 40)) || (ra.left - rb.left);
      });
      vis.forEach(function (e, i) { show(e.target, Math.min(i * 60, 420)); io.unobserve(e.target); });
    }, { rootMargin: '0px 0px -48px 0px', threshold: 0 });
  }

  function show(el, delay) {
    if (!el.classList.contains('fx-rv')) return;
    el.style.setProperty('--d', delay + 'ms');
    el.classList.add('fx-in');
    var done = false;
    function clean() {
      if (done) return; done = true;
      el.classList.remove('fx-rv', 'fx-in');
      el.style.removeProperty('--d');
      el.removeEventListener('animationend', onEnd);
    }
    function onEnd(ev) { if (ev.target === el) clean(); }
    el.addEventListener('animationend', onEnd);
    setTimeout(clean, delay + 1400);
  }

  /* only the outermost matching element of a nested group is animated */
  function topLevel(root, list) {
    return list.filter(function (el) {
      var p = el.parentElement;
      while (p && p !== root) { if (p.matches && p.matches(SEL)) return false; p = p.parentElement; }
      return true;
    });
  }
  function collect(root) {
    var list = $$(SEL, root);
    if (root.matches && root.matches(SEL)) list.unshift(root);
    return topLevel(root.parentElement || root, list);
  }

  function markRoute(app) {
    if (!io) return;
    collect(app).forEach(function (el) {
      if (el.classList.contains('fx-rv')) return;
      el.classList.add('fx-rv');
      io.observe(el);
    });
  }
  function revealNow(nodes) {
    var i = 0;
    nodes.forEach(function (n) {
      if (n.nodeType !== 1) return;
      collect(n).forEach(function (el) {
        if (el.classList.contains('fx-rv')) return;
        el.classList.add('fx-rv'); show(el, Math.min(i++ * 55, 330));
      });
    });
  }

  /* ------------------------------------------------------------------
     4. Wire up observers
     ------------------------------------------------------------------ */
  var lastHash = null;
  var watched = {};

  function bump(app, firstTime) {
    ['.qty output', '.kv .tot span:last-child'].forEach(function (s) {
      var el = $(s, app); if (!el) { delete watched[s]; return; }
      var t = el.textContent;
      if (!firstTime && watched[s] !== undefined && watched[s] !== t) {
        el.classList.add('fx-bump');
        el.addEventListener('animationend', function f() { el.classList.remove('fx-bump'); el.removeEventListener('animationend', f); });
      }
      watched[s] = t;
    });
  }

  function watchApp() {
    var app = $('#app'); if (!app) return;
    lastHash = location.hash;
    if (!reduce) markRoute(app);
    bump(app, true);

    new MutationObserver(function (muts) {
      var whole = false, partial = [];
      muts.forEach(function (m) {
        if (m.target === app) whole = true;
        else if (m.addedNodes.length) Array.prototype.push.apply(partial, m.addedNodes);
      });
      if (whole) {
        var navigated = location.hash !== lastHash;
        lastHash = location.hash;
        if (navigated) {
          watched = {};
          if (!reduce) { markRoute(app); app.animate && app.animate([{ opacity: 0.0 }, { opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' }); }
          bump(app, true);
        } else {
          bump(app, false);          /* same page re-rendered (quantity, selection…) */
        }
      } else if (partial.length && !reduce) {
        revealNow(partial);          /* search / filter / tab updates inside a page */
      }
    }).observe(app, { childList: true, subtree: true });
  }

  /* active tab pill / bottom-nav icon pop when the section changes */
  function watchNav() {
    var bn = $('#bnav'); if (!bn) return;
    var prev = -1;
    /* multi-page: the previous page's section is remembered, so the pop still plays when the section changes */
    var stored = -1;
    try { var sv = sessionStorage.getItem('ecbs.fx.nav'); stored = sv === null ? -1 : parseInt(sv, 10); if (isNaN(stored)) stored = -1; } catch (e) { stored = -1; }
    function popNav(idx) {
      var links = $$('#bnav a');
      var targets = [links[idx], $$('#hdr .nav a')[idx]];
      targets.forEach(function (t) {
        if (!t) return;
        t.classList.add('fx-pop');
        t.addEventListener('animationend', function f(e) { if (e.target === t || e.target.closest('a') === t) { t.classList.remove('fx-pop'); t.removeEventListener('animationend', f); } });
        setTimeout(function () { t.classList.remove('fx-pop'); }, 900);
      });
    }
    (function () {
      var links = $$('#bnav a'); var idx = -1;
      links.forEach(function (a, i) { if (a.classList.contains('on')) idx = i; });
      if (stored !== -1 && idx !== -1 && idx !== stored && !reduce && window.__fxNavType !== 'reload') popNav(idx);
      prev = idx;
      try { sessionStorage.setItem('ecbs.fx.nav', String(idx)); } catch (e) { /* ignore */ }
    })();
    new MutationObserver(function () {
      var links = $$('#bnav a'); var idx = -1;
      links.forEach(function (a, i) { if (a.classList.contains('on')) idx = i; });
      if (prev !== -1 && idx !== -1 && idx !== prev && !reduce) {
        var targets = [links[idx], $$('#hdr .nav a')[idx]];
        targets.forEach(function (t) {
          if (!t) return;
          t.classList.add('fx-pop');
          t.addEventListener('animationend', function f(e) { if (e.target === t || e.target.closest('a') === t) { t.classList.remove('fx-pop'); t.removeEventListener('animationend', f); } });
          setTimeout(function () { t.classList.remove('fx-pop'); }, 900);
        });
      }
      prev = idx;
      try { sessionStorage.setItem('ecbs.fx.nav', String(idx)); } catch (e) { /* ignore */ }
    }).observe(bn, { childList: true });
  }

  /* modal: smooth exit (the app removes the dialog instantly, so the
     removed node is shown for a moment in a non-interactive ghost layer) */
  function watchModal() {
    var ov = $('#ov'); if (!ov || reduce) return;
    new MutationObserver(function (muts) {
      if (ov.classList.contains('open')) return;
      muts.forEach(function (m) {
        Array.prototype.forEach.call(m.removedNodes, function (n) {
          if (n.nodeType !== 1 || !n.classList.contains('mdl')) return;
          $$('[id]', n).forEach(function (x) { x.removeAttribute('id'); });
          var g = document.createElement('div');
          g.className = 'fx-ghost'; g.setAttribute('aria-hidden', 'true'); g.inert = true;
          g.appendChild(n); document.body.appendChild(g);
          var ease = 'cubic-bezier(.4,0,1,1)';
          g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: ease, fill: 'forwards' });
          var a = n.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(14px) scale(.96)' }], { duration: 240, easing: ease, fill: 'forwards' });
          var rm = function () { if (g.parentNode) g.parentNode.removeChild(g); };
          a.onfinish = rm; setTimeout(rm, 400);
        });
      });
    }).observe(ov, { childList: true });
  }

  /* footer columns rise once as they scroll into view */
  function footerReveal() {
    if (!io) return;
    $$('#ftr > .container > div').forEach(function (el) { el.classList.add('fx-rv'); io.observe(el); });
  }

  function init() {
    buildBackground();
    headerScroll();
    watchApp();
    watchNav();
    watchModal();
    footerReveal();
  }
  /* the script tag sits at the end of <body>, after the app's own script, so the
     DOM is ready and the first route is already rendered: start before first paint */
  if ($('#app') && $('#hdr')) init(); else document.addEventListener('DOMContentLoaded', init);
})();
