/* tickets.js — Ticket: registered events and recent activity */
'use strict';

V.tickets = () => {
  POST = null;
  const rs = myRegs();
  return `<div class="container page"><div class="page-h"><div><h1>Ticket</h1><p>Manage your events, registrations, and item bookings.</p></div><a class="btn btn-p" href="${U('/events')}">${ic('search')}Explore Events</a></div>
  <div class="split"><div>${rs.length ? rs.map(r => { const e = evById(r.eventId), s = e.sessions.find(x => x.id === r.session); return `<article class="card tk" data-go="/ticket/${r.id}" style="margin-bottom:16px"><img src="${e.img}" alt=""><div><h3 style="font-size:20px;font-weight:800">${esc(e.title)}</h3><div class="muted" style="margin:4px 0 10px">${e.dateShort} · ${s.tShort} · ${e.city}</div><div class="row"><span class="st ${r.status === 'Checked In' ? 'bur' : ''}">${r.status}</span><span class="tiny muted">${r.id}</span></div></div><span class="round-btn" style="background:var(--rose);color:var(--bur)">${ic('chev')}</span></article>`; }).join('') : empty('ticket', 'No tickets yet', 'Register for an event and your digital ticket will appear here.', '<a class="btn btn-p" href="' + U('/events') + '">Explore Events</a>')}</div>
  <div><div class="card stat split-r" style="position:static;margin-bottom:20px"><div><small>Registered Events</small><span class="n">${rs.length}</span></div>${rs.length ? '<span class="st">Registered</span>' : ''}</div>
  <div class="sec-h" style="margin:0 0 12px"><h2 style="font-size:20px">Recent Activity</h2></div><div class="card act-list">${S.acts.length ? S.acts.slice(0, 6).map(a => `<div class="act"><span class="d"></span><div><b>${esc(a.title)}</b><small>${esc(a.time)}</small></div></div>`).join('') : '<div class="act"><div><small>No activity yet.</small></div></div>'}</div></div></div></div>`;
};
