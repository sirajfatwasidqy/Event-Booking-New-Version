/* events.js — Explore Events: live search + category filter */
'use strict';

function evListHtml(q, c) {
  const k = q.trim().toLowerCase();
  const list = EVENTS.filter(e => (c === 'All' || e.category === c) && (!k || [e.title, e.city, e.category, e.card, e.dateLong].join(' ').toLowerCase().includes(k)));
  return list.length ? list.map(evRow).join('') : empty('search', 'No events found', 'Try a different keyword or category.', '<button class="btn btn-p" data-act="clearSearch">Clear search</button>');
}
V.events = (_, qs) => {
  let q = qs.q || '', c = ['All', 'Exhibition', 'Gathering', 'Showcase'].includes(qs.c) ? qs.c : 'All';
  const f = EVENTS[0];
  POST = () => {
    const inp = $('#eq'); let t;
    const upd = () => { $('#evlist').innerHTML = evListHtml(q, c); $('#ecount').textContent = plural($$('#evlist .ev-row').length, 'event') + ' shown'; $('#eload').innerHTML = ''; history.replaceState(null, '', U('/events' + (q || c !== 'All' ? '?' + [q ? 'q=' + encodeURIComponent(q) : '', c !== 'All' ? 'c=' + c : ''].filter(Boolean).join('&') : ''))); };
    inp.addEventListener('input', () => { q = inp.value; $('#eload').innerHTML = '<span class="spin dark"></span> Searching events…'; clearTimeout(t); t = setTimeout(upd, 350); });
    $$('.chip-f').forEach(b => b.addEventListener('click', () => { c = b.dataset.c; $$('.chip-f').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); upd(); }));
    window.__clearSearch = () => { q = ''; inp.value = ''; c = 'All'; $$('.chip-f').forEach(x => x.classList.toggle('on', x.dataset.c === 'All')); upd(); };
  };
  return `<div class="container page"><div class="page-h"><div><h1>Explore Events</h1><p>Browse exhibitions, gatherings and showcases from PT Duta Abadi Primantara.</p></div></div>
  <div class="toolbar"><div class="search-b" role="search">${ic('search')}<input id="eq" value="${esc(q)}" placeholder="Search events..." aria-label="Search events"><span class="round-btn" aria-hidden="true">${ic('filter')}</span></div>
  <div class="filters" role="group" aria-label="Event category">${['All', 'Exhibition', 'Gathering', 'Showcase'].map(x => `<button class="chip-f ${x === c ? 'on' : ''}" data-c="${x}" aria-pressed="${x === c}">${x}</button>`).join('')}</div></div>
  <div class="row muted tiny" style="margin-top:14px;min-height:22px"><span id="eload"></span></div>
  <div class="banner-cta"><div style="position:relative;z-index:1"><div class="eyebrow">Featured Event</div><h2>${f.title}</h2><p style="opacity:.88;margin-bottom:22px">${f.dateLong} · ${f.city} · ${f.category}</p><button class="btn btn-w btn-lg" data-act="register" data-id="${f.id}">${regFor(f.id) ? 'View Ticket' : 'Register Now'} ${ic('arrow')}</button></div><img src="${f.img}" alt="${esc(f.title)} banner"></div>
  <div class="sec-h" style="margin-top:36px"><h2>Upcoming Events</h2><span class="muted tiny" id="ecount">${plural(EVENTS.filter(e => (c === 'All' || e.category === c)).length, 'event')} shown</span></div>
  <div class="grid" id="evlist" style="gap:16px">${evListHtml(q, c)}</div></div>`;
};
