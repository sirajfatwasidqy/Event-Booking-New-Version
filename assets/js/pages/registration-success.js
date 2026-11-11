/* registration-success.js — Registration success with e-ticket and QR */
'use strict';

V.regdone = id => {
  const r = S.regs.find(x => x.id === id); if (!r) return notFound();
  const e = evById(r.eventId), s = e.sessions.find(x => x.id === r.session);
  POST = null;
  return `<div class="container page" style="max-width:860px">${succ('Registration Successful', 'Your registration QR code has been generated successfully. Your e-ticket has also been sent to your email address.')}
  <div class="ticket"><div class="t-body"><div class="between row"><div><small class="muted" style="font-weight:600">Registration ID</small><div style="font-size:30px;font-weight:800;color:var(--bur);line-height:1.2">${r.id}</div></div><span class="st">Registered</span></div>
  <hr class="sp">${kv([['Customer Name', esc(me().name)], ['Ticket', r.participants], ['Event', esc(e.short)], ['Selected Date', e.dateLong], ['Selected Session', s.name], ['Selected Time', s.time.replace(/ /g, ' ')]])}</div>
  <div class="perf"></div><div class="qr-row" style="justify-content:center;flex-direction:column;text-align:center">${qrBox(r.id)}<span class="id-pill">${r.id}</span></div></div>
  <div class="acts" style="margin-top:24px"><button class="btn btn-p btn-lg" data-act="dlTicket" data-id="${r.id}">${ic('down')}Download Ticket</button><button class="btn btn-o btn-lg" data-act="addCal" data-id="${r.id}">${ic('calp')}Add to Calendar</button></div>
  <p style="text-align:center;margin-top:20px"><a class="link" href="${U('/ticket/' + (r.id))}">View Registration</a></p></div>`;
};
