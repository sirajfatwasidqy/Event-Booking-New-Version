/* ui.js — toast, modal and download helpers */
'use strict';

/* ===================== ui helpers ===================== */
/* Toasts survive page changes: the ones still on screen when a page is left are re-shown (with the time they had left) on the next page,
   which is how they behaved when the site was a single page. */
const ACTIVE_TOASTS = [];
function toast(msg, kind = '', life = 3200) {
  const w = $('#toasts'); const t = document.createElement('div'); t.className = 'toast ' + kind; t.setAttribute('role', 'status');
  t.innerHTML = (kind === 'ok' ? ic('check') : kind === 'bad' ? ic('x') : ic('info')) + `<span>${esc(msg)}</span>`; w.appendChild(t);
  const rec = { msg, kind, end: Date.now() + life }; ACTIVE_TOASTS.push(rec);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = '.3s'; setTimeout(() => { t.remove(); const i = ACTIVE_TOASTS.indexOf(rec); if (i >= 0) ACTIVE_TOASTS.splice(i, 1); }, 300); }, life);
}
function persistToasts() {
  try {
    const now = Date.now(); const live = ACTIVE_TOASTS.filter(t => t.end - now > 350).map(t => ({ msg: t.msg, kind: t.kind, left: t.end - now }));
    if (live.length) sessionStorage.setItem('ecbs.toasts', JSON.stringify(live));
  } catch (e) { /* ignore */ }
}
function restoreToasts() {
  try {
    const raw = sessionStorage.getItem('ecbs.toasts'); if (!raw) return;
    sessionStorage.removeItem('ecbs.toasts');
    JSON.parse(raw).forEach(t => toast(t.msg, t.kind, Math.max(600, t.left)));
  } catch (e) { /* ignore */ }
}
window.addEventListener('pagehide', persistToasts);
let lastFocus = null;
function modal(html, cls = '') { lastFocus = document.activeElement; const o = $('#ov'); o.innerHTML = `<div class="mdl ${cls}" role="dialog" aria-modal="true">${html}</div>`; o.classList.add('open'); const f = $('.mdl button, .mdl input', o); if (f) f.focus(); }
function closeModal() { const o = $('#ov'); o.classList.remove('open'); o.innerHTML = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
function download(name, text, mime = 'text/plain') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime + ';charset=utf-8' })); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
