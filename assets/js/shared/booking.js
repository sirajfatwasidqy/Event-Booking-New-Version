/* booking.js — helpers shared by the booking success / booking detail pages */
'use strict';

function bkDetail(id, fresh) {
  const b = S.bookings.find(x => x.id === id); if (!b) return notFound();
  const p = prById(b.productId), e = evById(b.eventId);
  POST = null;
  return `<div class="container page">${fresh ? succ('Booking Confirmed', 'Your booking has been confirmed successfully.<br>Please present your QR code at the event POS to complete your order.') : crumbs([['Booking History', '/bookings'], ['Booking Detail']]) + `<div class="page-h"><div><h1>Booking Detail</h1></div><span class="st">${b.status}</span></div>`}
  <div class="dl-split" style="max-width:1040px;margin:0 auto"><div class="ticket"><div class="qr-row" style="justify-content:center;flex-direction:column;text-align:center;padding-bottom:22px">${qrBox(b.id)}<small class="muted" style="font-weight:600">Scan at the event POS</small></div><div class="perf"></div><div class="t-body">${kv([['Booking ID', `<span style="color:var(--bur)">${b.id}</span>`], ['Event', esc(e.short)], ['Product', esc(p.unitType)], ['Size', p.size || '—'], ['Quantity', plural(b.qty, 'item')], ['Total Price', rp(p.price * b.qty), 'tot'], ['Status', `<span class="st">${b.status}</span>`]])}</div></div>
  <div><div class="card card-pad"><div class="row" style="align-items:flex-start;gap:16px"><img src="${p.images[0]}" alt="" style="width:130px;border-radius:14px;aspect-ratio:4/3;object-fit:cover"><div><span class="eyebrow">${p.brand}</span><h3 style="font-size:17px;line-height:1.35">${esc(p.name)}</h3><div class="price" style="font-size:18px;margin-top:4px">${rp(p.price)}</div></div></div><hr class="sp"><div class="tiny muted" style="margin-bottom:8px">Lot / Serial Number</div><b style="color:var(--bur)">${b.lot || 'Assigned at POS'}</b><div style="margin-top:16px">${ean13(p.barcode)}</div></div>
  <div class="acts col" style="margin-top:20px">${fresh ? `<a class="btn btn-p btn-lg" href="${U('/bookings')}">${ic('list')}View Booking</a>` : `<a class="btn btn-p btn-lg" href="${U('/bookings')}">${ic('list')}Back to Booking History</a>`}<button class="btn btn-o btn-lg" data-act="dlBooking" data-id="${b.id}">${ic('down')}Download Confirmation</button><a class="btn btn-s btn-lg" href="${U('/scanner')}">${ic('bag')}Continue Shopping</a></div></div></div></div>`;
}
