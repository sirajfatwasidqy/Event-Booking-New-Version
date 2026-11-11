/* listeners.js — document-level click / change / keyboard listeners */
'use strict';

document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-close]')) return closeModal();
  if (t.id === 'ov') return closeModal();
  const a = t.closest('[data-act]');
  if (a) { if (a.tagName === 'INPUT') return act(a.dataset.act, a, e); if (a.tagName === 'LABEL') return; act(a.dataset.act, a, e); return; }
  const g = t.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  if (!t.closest('.acct')) { const m = $('#acm'); if (m) { m.classList.remove('open'); const b = $('.acct-btn'); if (b) b.setAttribute('aria-expanded', 'false'); } }
});
document.addEventListener('change', e => {
  if (e.target.id === 'tsel') { S.draft.session = e.target.value || null; save(); rerender(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if ($('#ov').classList.contains('open')) closeModal(); const m = $('#acm'); if (m) m.classList.remove('open'); }
  if (e.key === 'Enter' && e.target.matches && e.target.matches('[data-go]:not(button):not(a)')) go(e.target.dataset.go);
});
