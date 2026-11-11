/* register-event-summary.js — Event registration — step 2 (summary and confirmation) */
'use strict';

V.reg2 = () => {
  const e = regEvent(), d = S.draft, s = e.sessions && e.sessions.find(x => x.id === d.session);
  if (!s || !d.agreed) return setTimeout(() => go('/register-event/1'), 0), '';
  POST = null;
  return `<div class="container page">${crumbs([['Events', '/events'], [esc(e.short), '/event/' + e.id], ['Event Registration']])}<div class="page-h"><div><h1>Registration Summary</h1><p>Review your registration before continuing.</p></div></div>${stepBar(2)}
  <div class="split"><div class="card card-pad"><h2 style="font-size:22px;margin-bottom:6px">Registration Summary</h2>${kv([['Event', esc(e.short)], ['Date', e.dateLong], ['Location', e.city], ['Session', s.name], ['Time', s.time], ['Participants', d.participants + (d.participants === 1 ? ' person' : ' people')], ['Registration Fee', '<span style="color:var(--ok);font-size:20px">Free</span>', 'tot']])}
  <div class="callout" style="margin:22px 0">${ic('clock')}<span>Show the QR Code when you arrive at the location.</span></div>
  <div class="acts"><button class="btn btn-o" data-go="/register-event/1" style="flex:0 0 auto">${ic('back')}Back</button><button class="btn btn-p btn-lg" id="confirmReg" data-act="reg2confirm">Continue ${ic('arrow')}</button></div></div>
  <div><div class="card card-pad split-r"><div class="eyebrow" style="margin-bottom:8px">Event</div><h3 style="font-size:20px;margin-bottom:12px">${esc(e.title)}</h3><div class="addr">${ic('pin')}<span>${esc(e.address)}</span></div></div></div></div></div>`;
};
