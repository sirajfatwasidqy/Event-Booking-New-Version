/* home.js — Home screen (hero with animated Swirl background, upcoming events, quick access) */
'use strict';

V.home = () => {
  POST = () => { $('#hs').addEventListener('submit', e => { e.preventDefault(); go('/events' + ($('#hsq').value.trim() ? '?q=' + encodeURIComponent($('#hsq').value.trim()) : '')); }); Swirl.start($('.swirl-bg')); };
  const f = EVENTS[0];
  const quick = [['/events', 'search', 'Explore Events', 'Find upcoming events'], ['/tickets', 'ticket', 'Ticket', 'Registered events & QR codes'], ['/scanner', 'camera', 'Scan Product Barcode', 'Book items for POS pickup'], ['/bookings', 'box', 'Booking History', 'Your item bookings']];
  return `<section class="hero">${Swirl.markup}<div class="container"><div>
    <div class="tag"><span class="logo-pill"><img src="${brandLogo}" alt="DAP"></span><div><small>PT Duta Abadi Primantara</small><b>Event Booking</b></div></div>
    <h1>Manage your events, registrations, and item orders.</h1>
    <p class="lead">Discover exclusive PT Duta Abadi Primantara events, register, get your digital ticket, and order items through QR Code Order.</p>
    <form id="hs" class="search-xl" role="search">${ic('search')}<input id="hsq" placeholder="Search events..." aria-label="Search events"><button type="button" class="round-btn" aria-label="Open filters" data-go="/events">${ic('filter')}</button></form>
  </div>
  <div class="feat"><img src="${f.img}" alt="${esc(f.title)} banner"><div class="feat-body"><div class="eyebrow">Featured Event</div><h2>${f.title}</h2><div class="meta">${f.dateLong} · ${f.city}</div><button class="btn btn-w" data-go="/event/${f.id}">View Event ${ic('arrow')}</button></div></div>
  </div></section>
  <div class="container"><div class="sec-h"><h2>Upcoming Events</h2><a class="link" href="${U('/events')}">View all ${ic('chev')}</a></div>
  <div class="grid g3">${EVENTS.map(evCard).join('')}</div>
  <div class="sec-h"><h2>Quick Access</h2></div>
  <div class="grid g4" style="margin-bottom:72px">${quick.map(q => `<a class="card card-pad card-link" href="${U((q[0]))}" style="display:flex;gap:16px;align-items:center;transition:.2s"><span class="ic" style="width:52px;height:52px;border-radius:16px;background:var(--rose);color:var(--bur);display:grid;place-items:center">${ic(q[1])}</span><span><b style="display:block">${q[2]}</b><small class="muted">${q[3]}</small></span></a>`).join('')}</div></div>`;
};
