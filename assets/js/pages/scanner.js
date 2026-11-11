/* scanner.js — Scan Product Barcode (simulated camera scan) */
'use strict';

V.scanner = () => {
  POST = () => {
    const match = code => PRODUCTS.find(p => p.barcode === code.replace(/\s/g, ''));
    const found = p => { const sc = $('#scan'); sc.classList.add('done'); $('#scap').textContent = 'Barcode ' + p.barcode + ' recognised'; $('#scwin').innerHTML = ean13(p.barcode); toast('Product found: ' + p.brand, 'ok'); setTimeout(() => go('/product/' + p.id), 1000); };
    window.__sim = () => { const p = PRODUCTS[S.scanIdx % PRODUCTS.length]; S.scanIdx++; save(); found(p); };
  };
  return `<div class="container page">${crumbs([['Booking', '/bookings'], ['Scan Product Barcode']])}<div class="page-h"><div><h1>Scan Product Barcode</h1><p>Point the camera at the product label to find the item.</p></div></div>
  <div class="dl-split" style="grid-template-columns:minmax(0,1.4fr) minmax(0,1fr)"><div class="scanner" id="scan"><img src="assets/img/scan-label.webp" alt="Product label with barcode"><div class="win" id="scwin"><div class="inner"><span class="cn a"></span><span class="cn b"></span><span class="cn c"></span><span class="cn d"></span><div class="bc">${ean13('8901234567890', '#0f172a').replace('class="bcimg"', 'style="all:unset"').replace(/<small>.*<\/small>/, '')}</div></div></div><span class="scanline"></span><div class="cap" id="scap">Align the barcode inside the frame</div></div>
  <div class="card card-pad"><h2 style="font-size:20px;margin-bottom:6px">Scan options</h2><p class="muted" style="margin-bottom:18px">This website demo simulates the camera scan.</p><button class="btn btn-p btn-lg btn-block" data-act="sim">${ic('scan')}Simulate Scan</button><hr class="sp">
  <div class="demo-note">Demo barcodes: <b>8901234567890</b> (KING KOIL) · <b>8901234567906</b> (SERTA)</div></div></div></div>`;
};
