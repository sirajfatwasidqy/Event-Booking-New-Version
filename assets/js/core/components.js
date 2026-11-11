/* components.js — shared view templates: breadcrumbs, event cards, empty/not-found, account sidebar, key-value, success */
'use strict';

const crumbs = a => `<nav class="crumbs" aria-label="Breadcrumb">${a.map((x, i) => x[1] ? `<a href="${U((x[1]))}">${x[0]}</a>${i < a.length - 1 ? ic('chev') : ''}` : `<span>${x[0]}</span>`).join('')}</nav>`;
const brandLogo = 'assets/img/dap-logo.png';
const evCard = e => `<article class="card ev-card" data-go="/event/${e.id}"><div class="ev-img ${e.cls} ${e.wide ? 'wide' : ''}"><img src="${e.img}" alt="${esc(e.title)}" loading="lazy"></div><div class="ev-body"><span class="eyebrow">${e.category}</span><h3>${esc(e.title)}</h3><div class="ev-meta"><span>${ic('cal')}${e.dateShort}</span><span>${ic('pin')}${e.city}</span></div><p>${esc(e.card)}</p><div class="ev-actions"><button class="btn btn-p btn-sm" data-go="/event/${e.id}">View Event</button></div></div></article>`;
const evRow = e => `<article class="card ev-row" data-go="/event/${e.id}"><div class="th ${e.cls}"><img src="${e.img}" alt="" loading="lazy"></div><div><span class="eyebrow">${e.category}</span><h3>${esc(e.title)}</h3><div class="ev-meta" style="margin-top:6px"><span>${ic('cal')}${e.dateShort}</span><span>${ic('pin')}${e.city}</span></div><p>${esc(e.card)}</p></div><button class="btn btn-p btn-sm" data-act="register" data-id="${e.id}">${regFor(e.id) ? 'View Ticket' : 'Register Now'}</button></article>`;
const empty = (icon, t, p, btn) => `<div class="card empty"><div class="ring">${ic(icon)}</div><h3>${t}</h3><p>${p}</p>${btn || ''}</div>`;
const notFound = () => `<div class="container page">${empty('info', 'Page not found', 'The page you are looking for does not exist.', '<a class="btn btn-p" href="' + U('/home') + '">Back to Home</a>')}</div>`;
const side = act => {
  const L = [['/profile', 'user', 'Profile'], ['/notifications', 'bell', 'Notification'], ['/privacy', 'shield', 'Privacy & Security'], ['/bookings', 'box', 'Booking History']];
  const u = me();
  return `<aside class="card side"><div class="u"><span class="avatar">${esc(initials(u.name))}</span><div><b>${esc(u.name)}</b><small>${esc(u.id)}</small></div></div><nav aria-label="Account">${L.map(l => `<a href="${U((l[0]))}" class="${act === l[0] ? 'on' : ''}" ${act === l[0] ? 'aria-current="page"' : ''}>${ic(l[1])}${l[2]}${l[0] === '/notifications' && unread() ? `<span class="st bad" style="margin-left:auto;height:22px;padding:0 9px;font-size:11.5px">${unread()}</span>` : ''}</a>`).join('')}</nav><div class="sp"></div><button class="btn btn-d btn-block" data-act="logout" style="margin-top:6px">${ic('out')}Log Out</button></aside>`;
};
const kv = rows => `<div class="kv">${rows.map(r => `<div class="r ${r[2] || ''}"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')}</div>`;
const succ = (t, p) => `<div class="succ"><div class="ring"><div class="disc">${ic('check')}</div></div><h1>${t}</h1>${p ? `<p>${p}</p>` : ''}</div>`;
