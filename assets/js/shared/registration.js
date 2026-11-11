/* registration.js — helpers shared by the registration step pages */
'use strict';

const regEvent = () => evById(S.ctx || 'sampoerna');
const stepBar = n => `<div class="steps"><div class="${n >= 1 ? 'on' : ''}"><i></i><span>Step 1 dari 2 · Event & Session</span></div><div class="${n >= 2 ? 'on' : ''}"><i></i><span>Step 2 dari 2 · Summary</span></div></div>`;
function regSummary(e, withBtn) {
  const d = S.draft, s = e.sessions.find(x => x.id === d.session);
  return `<div class="card card-pad split-r"><h2 style="font-size:20px;margin-bottom:6px">Registration Summary</h2>${kv([['Event', esc(e.short)], ['Date', e.dateLong], ['Location', e.city], ['Session', s ? s.name : '<span class="muted">Not selected</span>'], ['Time', s ? s.time : '<span class="muted">—</span>'], ['Participants', d.participants + (d.participants === 1 ? ' person' : ' people')], ['Registration Fee', '<span style="color:var(--ok)">Free</span>']])}</div>`;
}
