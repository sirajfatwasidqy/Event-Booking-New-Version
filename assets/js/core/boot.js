/* boot.js — runs last on every page: resolves the page definition, renders it, restores cross-page toasts. */
'use strict';
(function () {
  const key = document.body.dataset.page;
  PAGE = key === 'notfound' ? { key: 'notfound', path: '/404', nav: '', auth: 0, title: 'Page not found' } : pageByKey(key);
  PAGE_ID = PAGE.id ? (new URLSearchParams(location.search).get('id') || '') : '';
  /* back/forward cache: always show fresh state after login / logout / booking */
  window.addEventListener('pageshow', e => { if (e.persisted) location.reload(); });
  route();
  restoreToasts();
})();
