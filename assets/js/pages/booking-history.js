/* booking-history.js — Booking History with live search */
'use strict';

V.bookings = (_, qs) => {
  let q = qs.q || '';
  const list = () => { const k = q.trim().toLowerCase(); return S.bookings.filter(b => { const p = prById(b.productId); return !k || (p.name + ' ' + b.id + ' ' + p.barcode).toLowerCase().includes(k); }); };
  const item = b => { const p = prById(b.productId), e = evById(b.eventId); return `<article class="card bk" style="margin-bottom:18px"><div class="im"><img src="${p.images[0]}" alt="" loading="lazy"></div><div><div class="between row" style="align-items:flex-start"><h3>${esc(p.name)}</h3><span class="st">${b.status}</span></div><div class="price" style="margin-top:6px">${rp(p.price * b.qty)}</div><div class="meta"><span>Booking ID <b>${b.id}</b></span><span>Qty <b>${b.qty}</b></span><span>Event <b>${esc(e.short)}</b></span></div><div class="foot"><span class="tiny muted">Lot / Serial Number: Assigned at POS</span><button class="btn btn-p btn-sm" data-go="/booking-detail/${b.id}">View Detail</button></div></div></article>`; };
  POST = () => { const i = $('#bq'); let t; i.addEventListener('input', () => { q = i.value; clearTimeout(t); t = setTimeout(() => { const l = list(); $('#blist').innerHTML = l.length ? l.map(item).join('') : empty('search', 'No bookings found', 'Try a different keyword or Booking ID.'); $('#bshow').textContent = `Showing ${l.length} of ${S.bookings.length} bookings`; }, 250); }); };
  return `<div class="container page"><div class="page-h"><div><h1>Booking History</h1><p>Your item bookings for POS pickup.</p></div></div>
  <div class="grid g2" style="margin-bottom:28px"><div class="card stat"><div><small>My Bookings</small><span class="n">${S.bookings.length}</span></div>${S.bookings.length ? '<span class="st">Confirmed</span>' : ''}</div><article class="card stat" data-go="/scanner" style="cursor:pointer"><div><small>Scan Product Barcode</small><b style="font-size:18px">Find an item and book it</b></div><span class="round-btn">${ic('camera')}</span></article></div>
  <div class="toolbar" style="margin-bottom:22px"><div class="search-b" role="search">${ic('search')}<input id="bq" value="${esc(q)}" placeholder="Search items or barcode..." aria-label="Search bookings"></div></div>
  <h2 style="font-size:20px;margin-bottom:14px">My Bookings</h2><div id="blist">${S.bookings.length ? list().map(item).join('') : empty('box', 'No bookings yet', 'Scan a product barcode to book an item.')}</div>
  ${S.bookings.length ? `<p class="muted tiny" id="bshow" style="text-align:center;margin-top:10px">Showing ${list().length} of ${S.bookings.length} bookings</p>` : ''}</div>`;
};
