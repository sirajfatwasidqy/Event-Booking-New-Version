/* qr.js — QR + EAN-13 barcode SVG renderers */
'use strict';

/* ===================== QR + barcode ===================== */
function qrSvg(id, color = '#641E35') {
  const d = QRDATA[id];
  if (!d) return `<svg class="q" viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/><text x="50" y="54" text-anchor="middle" font-size="10" fill="#641E35">QR ${esc(id)}</text></svg>`;
  const n = d[0], bits = BigInt('0x1' + d[1]).toString(2).slice(1, 1 + n * n);
  let p = '';
  for (let r = 0; r < n; r++) { let c = 0; while (c < n) { if (bits[r * n + c] === '1') { const s = c; while (c < n && bits[r * n + c] === '1') c++; p += `M${s} ${r}h${c - s}v1h-${c - s}z`; } else c++; } }
  return `<svg class="q" viewBox="-2 -2 ${n + 4} ${n + 4}" role="img" aria-label="QR code for ${esc(id)}" shape-rendering="crispEdges"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/><path d="${p}" fill="${color}"/></svg>`;
}
const qrBox = id => `<div class="qr-box"><i></i><i></i><b></b><b></b>${qrSvg(id)}</div>`;

function ean13(code, color = '#111') {
  const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
  const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111'];
  const Rr = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
  const par = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];
  const d = code.split('').map(Number); let b = '101';
  for (let i = 1; i <= 6; i++) b += (par[d[0]][i - 1] === 'L' ? L : G)[d[i]];
  b += '01010';
  for (let i = 7; i <= 12; i++) b += Rr[d[i]];
  b += '101';
  let rects = ''; for (let i = 0; i < b.length;) { if (b[i] === '1') { let j = i; while (b[j] === '1') j++; rects += `<rect x="${i + 9}" y="0" width="${j - i}" height="60" fill="${color}"/>`; i = j; } else i++; }
  return `<div class="bcimg"><svg viewBox="0 0 113 60" role="img" aria-label="Barcode ${code}" shape-rendering="crispEdges" preserveAspectRatio="none">${rects}</svg><small>${code.slice(0, 1)} ${code.slice(1, 7)} ${code.slice(7)}</small></div>`;
}
