/* fx-boot.js — tiny head script for the multi-page build.
   Knows whether this is the first page of the visit, so the header / bottom bar intro animation plays once (like the original single page)
   and the animated background carries on from where the previous page left it instead of restarting. */
(function () {
  'use strict';
  var root = document.documentElement, t0 = null, nav = '';
  try {
    nav = ((window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {}).type || '';
    t0 = sessionStorage.getItem('ecbs.fx.t0');
    if (!t0) { t0 = String(Date.now()); sessionStorage.setItem('ecbs.fx.t0', t0); }
    else if (nav !== 'reload') root.classList.add('fx-nav');
  } catch (e) { t0 = null; }
  window.__fxNavType = nav;
  window.__fxElapsed = t0 ? Math.max(0, (Date.now() - Number(t0)) / 1000) : 0;
})();
