/* check-in.js — Check-in success and next step */
'use strict';

V.checkin = id => {
  const r = S.regs.find(x => x.id === id); if (!r) return notFound();
  if (r.status !== 'Checked In') { r.status = 'Checked In'; addNote('event', 'ok', 'check', 'Check-in Successful', `You are checked in to ${evById(r.eventId).short}.`, '/checkin/' + r.id); addAct('Check-in ' + evById(r.eventId).short); save(); }
  const e = evById(r.eventId), s = e.sessions.find(x => x.id === r.session);
  POST = null;
  return `<div class="container page" style="max-width:860px">${succ('Check-in Successful', `Welcome to ${esc(e.short)}.<br>Your registration has been verified.`)}
  <div class="card card-pad"><div class="between row" style="margin-bottom:6px"><b style="font-size:12.5px;letter-spacing:.12em">CHECK-IN DETAILS</b><span class="st">Checked In</span></div><hr class="sp" style="margin-top:12px">${kv([['Registration ID', `<span style="color:var(--bur)">${r.id}</span>`], ['Customer', esc(me().name)], ['Event', esc(e.short)], ['Date', e.dateLong], ['Session', s.name], ['Time', s.tShort]])}</div>
  <div class="eyebrow" style="margin:28px 0 10px">Next Step</div>
  <article class="card" data-go="/scanner" style="background:var(--bur);color:#fff;border:0;padding:26px 30px;display:flex;align-items:center;gap:20px;cursor:pointer;position:relative;overflow:hidden"><span style="width:60px;height:60px;border-radius:18px;background:rgba(255,255,255,.14);display:grid;place-items:center">${ic('bag')}</span><div style="flex:1"><b style="font-size:20px;display:block">Booking Event Item<br>for POS Pickup</b><small style="opacity:.8">Scan an item barcode to book it.</small></div><span class="round-btn" style="background:rgba(255,255,255,.18)">${ic('arrow')}</span></article>
  <p style="text-align:center;margin-top:22px"><a class="link" href="${U('/tickets')}" style="color:var(--chr)">Maybe later</a></p></div>`;
};
