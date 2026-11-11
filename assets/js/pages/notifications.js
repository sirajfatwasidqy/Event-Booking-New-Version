/* notifications.js — Notifications with tabs and mark-all-read */
'use strict';

V.notes = () => {
  let tab = 'all';
  const items = () => S.notes.filter(n => tab === 'all' || (tab === 'bookings' ? n.type === 'booking' : n.type === 'event'));
  const itemH = n => `<button class="card nt ${n.read ? '' : 'unread'} ${n.kind}" data-act="openNote" data-id="${n.id}"><span class="ic">${ic(n.icon)}</span><span><b>${esc(n.title)}</b><p>${esc(n.msg)}</p></span><time>${esc(n.time)}</time>${n.read ? '' : '<span class="ud" aria-label="Unread"></span>'}</button>`;
  const draw = () => { const l = items(); $('#nlist').innerHTML = l.length ? l.map(itemH).join('') : empty('bell', 'No notifications', 'Booking and event updates will appear here.'); $$('.tab').forEach(t => { t.classList.toggle('on', t.dataset.t === tab); t.setAttribute('aria-selected', t.dataset.t === tab); }); };
  POST = () => { $$('.tab').forEach(t => t.addEventListener('click', () => { tab = t.dataset.t; draw(); })); window.__ndraw = draw; };
  return `<div class="container page"><div class="acc">${side('/notifications')}<div><div class="page-h"><div><h1>Notification</h1></div><div class="tabs" role="tablist">${[['all', 'All'], ['bookings', 'Bookings'], ['events', 'Events']].map(t => `<button class="tab ${t[0] === 'all' ? 'on' : ''}" role="tab" data-t="${t[0]}" aria-selected="${t[0] === 'all'}">${t[1]}</button>`).join('')}</div></div>
  <div class="grp"><b class="eyebrow" style="color:#6a5a60">Today</b><button class="link" data-act="readAll">Mark all as read</button></div><div id="nlist">${items().length ? items().map(itemH).join('') : empty('bell', 'No notifications', 'Booking and event updates will appear here.')}</div></div></div></div>`;
};
