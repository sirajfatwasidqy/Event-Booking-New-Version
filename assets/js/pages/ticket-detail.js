/* ticket-detail.js — Ticket detail with check-in QR */
'use strict';

V.ticket = id => {
  const r = S.regs.find(x => x.id === id); if (!r) return notFound();
  const e = evById(r.eventId), s = e.sessions.find(x => x.id === r.session), u = me();
  POST = null;
  return `<div class="container page" style="max-width:900px">${crumbs([['Ticket', '/tickets'], ['Ticket Detail']])}<div class="page-h"><div><h1>Ticket Detail</h1></div></div>
  <div class="ticket"><div class="t-top"><div><small>EVENT TICKET</small><h2>${esc(e.short)}</h2></div><span class="st solid">${r.status}</span></div>
  <div class="t-body"><div class="fields"><div class="f"><small>Customer</small><b>${esc(u.name)}</b></div><div class="f"><small>Ticket</small><b>${r.participants}</b></div><div class="f"><small>Registration ID</small><b>${r.id}</b></div><div class="f"><small>Date</small><b>${e.dateLong}</b></div><div class="f"><small>Session</small><b>${s.name}</b></div><div class="f"><small>Time</small><b>${s.tShort}</b></div></div>
  <div class="addr" style="margin-top:18px">${ic('pin')}<span><b style="color:var(--chr)">Location</b><br>${esc(e.address)}</span></div></div>
  <div class="perf"></div><div class="qr-row">${qrBox(r.id)}<div><h3>Check-in QR Code</h3><p>Present this QR code at the event entrance for quick check-in.</p><span class="id-pill">${r.id}</span><div class="row" style="margin-top:16px;flex-wrap:wrap"><button class="btn btn-s btn-sm" data-act="bigQr" data-id="${r.id}">${ic('qr')}Show QR full size</button>${r.status === 'Registered' ? `<button class="btn btn-o btn-sm" data-act="simCheckin" data-id="${r.id}">${ic('scan')}Simulate check-in scan</button>` : `<a class="btn btn-o btn-sm" href="${U('/checkin/' + (r.id))}">${ic('check')}View check-in</a>`}</div></div></div></div>
  <div class="acts" style="margin-top:24px"><button class="btn btn-p btn-lg" data-act="dlTicket" data-id="${r.id}">${ic('down')}Download Ticket</button><button class="btn btn-o btn-lg" data-act="addCal" data-id="${r.id}">${ic('calp')}Add to Calendar</button></div></div>`;
};
