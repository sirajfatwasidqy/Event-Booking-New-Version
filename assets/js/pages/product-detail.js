/* product-detail.js — Product detail, gallery, quantity and Add to Booking */
'use strict';

V.product = id => {
  const p = prById(id); if (!p) return notFound();
  POST = () => {
    $$('.thumbs button').forEach(b => b.addEventListener('click', () => { $('#gmain').src = b.dataset.src; $$('.thumbs button').forEach(x => x.classList.toggle('on', x === b)); }));
    let n = 1;
    const upd = () => { $('#qv').textContent = n; $('#qm').disabled = n <= 1; $('#qp').disabled = n >= 5; $('#qtot').innerHTML = kv([['Total Price', rp(p.price * n), 'tot']]); };
    $('#qm').addEventListener('click', () => { n = Math.max(1, n - 1); upd(); });
    $('#qp').addEventListener('click', () => { n = Math.min(5, n + 1); upd(); });
  };
  return `<div class="container page">${crumbs([['Booking', '/bookings'], ['Scan Product Barcode', '/scanner'], ['Product Detail']])}<div class="split"><div>
  <div class="pimg" style="aspect-ratio:16/10;border-radius:22px;border:1px solid var(--line)"><img id="gmain" src="${p.images[0]}" alt="${esc(p.name)}"></div><div class="thumbs">${p.images.map((s, i) => `<button class="${i ? '' : 'on'}" data-src="${s}" aria-label="Image ${i + 1}"><img src="${s}" alt=""></button>`).join('')}</div>
  <div class="row" style="margin:26px 0 8px"><img src="${p.logo}" alt="${p.brand} logo" style="width:56px;height:56px;border-radius:12px"><span class="eyebrow">${p.brand}</span></div><h1 style="font-size:30px;line-height:1.25;font-weight:800">${esc(p.name)}</h1><p style="margin:14px 0;color:#3d3236;max-width:640px">${esc(p.desc)}</p><div style="margin-top:18px">${ean13(p.barcode)}</div></div>
  <div class="card card-pad split-r"><h2 style="font-size:21px">Booking Summary</h2>${kv([['Unit Type', esc(p.unitType)], p.size ? ['Size', p.size] : ['Size', '<span class="muted">Not specified</span>'], ['Lot / Serial Number', '<span style="color:var(--bur)">Assigned at POS</span>'], ['Unit Price', rp(p.price)]])}
  <div class="between row" style="margin:14px 0 4px"><div><b style="font-size:17px">Quantity</b><div class="tiny muted">Max 5 per booking</div></div><div class="qty"><button id="qm" aria-label="Decrease quantity" disabled>${ic('minus')}</button><output id="qv" aria-live="polite">1</output><button id="qp" aria-label="Increase quantity">${ic('plus')}</button></div></div>
  <div id="qtot">${kv([['Total Price', rp(p.price), 'tot']])}</div><button class="btn btn-p btn-lg btn-block" data-act="addBooking" data-id="${p.id}" style="margin-top:14px">${ic('bagp')}Add to Booking</button></div></div></div>`;
};
