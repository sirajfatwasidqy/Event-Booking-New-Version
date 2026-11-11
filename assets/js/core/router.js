/* router.js — page lifecycle for the multi-page build.
   Every HTML file sets <body data-page="…">; boot.js looks the page up in PAGES (routes.js) and calls route().
   Views (V.*) are the original view functions; `go('/some/route')` now navigates to the matching .html file. */
'use strict';

let POST = null;           // per-view hook that runs after the view is in the DOM
const V = {};              // view registry (filled by assets/js/pages/*.js)
let EDIT = new Set();      // profile fields currently being edited
let CUR = '';              // active navigation section (header / bottom nav)
let PAGE = null;           // definition of the current page (from PAGES)
let PAGE_ID = '';          // id parameter of the current page (?id=…)

const curUrl = () => (location.pathname.split('/').pop() || 'index.html') + location.search;
const routeOf = (def, id) => def.path + (def.id ? encodeURIComponent(id) : '');

/* navigate to a route string such as '/event/sampoerna' or '/events?q=expo'; same page → re-render in place */
const go = p => { const u = U(p); if (u === curUrl()) route(); else location.href = u; };

function route(keep) {
  const def = PAGE, id = PAGE_ID;
  const qs = Object.fromEntries(new URLSearchParams(location.search)); delete qs.id;
  const qstr = new URLSearchParams(qs).toString();
  const h = routeOf(def, id) + (qstr ? '?' + qstr : '');
  const app = $('#app');
  if (!keep) EDIT = new Set();
  if (def.auth && !isAuth()) { S.next = h; if (!/register-event/.test(def.path)) S.ctx = null; save(); location.replace(U('/login')); return; }
  if (isAuth() && (def.key === 'login' || def.key === 'register')) { location.replace(U('/home')); return; }
  closeModal(); POST = null;
  const html = V[def.key](id, qs);
  app.innerHTML = html; CUR = def.nav;
  document.title = def.title + ' · Event Booking — PT Duta Abadi Primantara';
  renderChrome();
  if (POST) POST();
  $$('[data-go]:not(button):not(a)', app).forEach(el => { el.tabIndex = 0; el.setAttribute('role', 'link'); });
  if (!keep) { window.scrollTo(0, 0); app.focus({ preventScroll: true }); }
}
const rerender = () => { const y = window.scrollY; route(true); window.scrollTo(0, y); };
V.notfound = () => notFound();
