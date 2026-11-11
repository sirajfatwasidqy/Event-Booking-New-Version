/* event-detail.js — Event detail with sessions and registration entry */
'use strict';

V.event = id => {
  const e = evById(id); if (!e) return notFound();
  const reg = regFor(e.id);
  const isS = !!e.sessions;
  POST = () => { };
  const left = `${crumbs([['Home', '/home'], ['Events', '/events'], [esc(e.short)]])}
  <div class="detail-banner ${e.wide ? '' : 'sq ' + e.cls}"><img src="${e.img}" alt="${esc(e.title)}"></div>
  <div class="detail"><h1>${esc(e.title)}</h1><div class="muted">Organized by PT Duta Abadi Primantara</div>
  <div class="chips">${e.duration ? `<span class="chip">${ic('cal')}${e.duration}</span>` : `<span class="chip">${ic('cal')}${e.dateLong}</span>`}<span class="chip">${ic('pin')}${e.city}</span><span class="chip" style="color:var(--chr)">${e.type}</span></div>
  <div class="sec-h" style="margin-top:30px"><h2 style="font-size:21px">About the Event</h2></div><p style="max-width:720px;color:#3d3236">${esc(e.about)}</p>
  ${e.schedule ? `<div class="sec-h" style="margin-top:34px"><h2 style="font-size:21px">Event Schedule</h2></div><div class="sched">${e.schedule.map(s => `<div><b>${s[0]}</b><span>${esc(s[1])}</span></div>`).join('')}</div>` : ''}
  ${e.highlights ? `<div class="sec-h" style="margin-top:34px"><h2 style="font-size:21px">Highlights</h2></div><div class="hl">${e.highlights.map(h => `<div><b>${h[0]}</b><span>${h[1]}</span></div>`).join('')}</div>` : ''}</div>`;
  const sel = S.draft.session;
  const right = isS ? `<div class="card card-pad split-r"><h2 style="font-size:21px;margin-bottom:16px">Available Sessions</h2><div class="grid" style="gap:12px" role="radiogroup" aria-label="Sessions">${e.sessions.map(s => `<button class="sess ${sel === s.id ? 'on' : ''}" role="radio" aria-checked="${sel === s.id}" data-act="pickSession" data-s="${s.id}"><span class="rd">${ic('check')}</span><span><b>${s.name}</b><small>${s.time}</small></span><span class="av">available</span></button>`).join('')}</div>
    <div class="addr" style="margin:20px 0">${ic('pin')}<span><b style="color:var(--chr)">Location · ${e.city}</b><br>${esc(e.address)}</span></div>
    <button class="btn btn-p btn-lg btn-block" data-act="register" data-id="${e.id}">${reg ? 'View Ticket' : 'Register Now'} ${ic('arrow')}</button>${reg ? '<p class="tiny muted" style="margin-top:10px;text-align:center">You are already registered for this event.</p>' : ''}</div>`
    : `<div class="card card-pad split-r"><h2 style="font-size:21px;margin-bottom:6px">Event Information</h2>${kv([['Date', e.dateLong], ['Location', e.city], ['Category', e.category]])}<p class="tiny muted" style="margin:14px 0 18px">Sessions and registration details for this event are not available yet.</p><a class="btn btn-o btn-block" href="${U('/events')}">Back to Events</a></div>`;
  return `<div class="container page"><div class="split"><div>${left}</div><div>${right}</div></div></div>`;
};
