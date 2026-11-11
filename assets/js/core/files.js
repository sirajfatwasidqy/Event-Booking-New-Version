/* files.js — downloadable ticket (SVG) and calendar (.ics) builders */
'use strict';

function icsFor(reg) {
  const e = evById(reg.eventId), s = e.sessions.find(x => x.id === reg.session);
  const [a, b] = s.tShort.split('–'); const [ah, am] = a.split(':').map(Number), [bh, bm] = b.split(':').map(Number);
  const [y, mo, da] = e.date.split('-').map(Number);
  const utc = (h, m) => { const d = new Date(Date.UTC(y, mo - 1, da, h - 7, m)); return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); };
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PT Duta Abadi Primantara//Event Booking//EN', 'BEGIN:VEVENT', `UID:${reg.id}@dap-event-booking`, `DTSTAMP:${utc(0, 0).slice(0, 8)}T000000Z`,
    `DTSTART:${utc(ah, am)}`, `DTEND:${utc(bh, bm)}`, `SUMMARY:${e.short} · ${s.name}`, `LOCATION:${(e.address || e.city).replace(/,/g, '\\,')}`, `DESCRIPTION:Registration ID ${reg.id}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
}
function ticketSvg(reg) {
  const e = evById(reg.eventId), s = e.sessions.find(x => x.id === reg.session), u = me();
  const q = qrSvg(reg.id).replace('<svg class="q"', '<svg x="430" y="130" width="150" height="150"');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="340" viewBox="0 0 620 340" font-family="Plus Jakarta Sans,Arial,sans-serif"><rect width="620" height="340" rx="20" fill="#fff" stroke="#E3D6DA"/><path d="M0 20a20 20 0 0 1 20-20h580a20 20 0 0 1 20 20v70H0z" fill="#641E35"/><text x="28" y="34" font-size="11" fill="#fff" fill-opacity=".75" letter-spacing="2">EVENT TICKET</text><text x="28" y="68" font-size="26" font-weight="800" fill="#fff">${esc(e.short)}</text><text x="592" y="40" font-size="12" font-weight="700" fill="#fff" text-anchor="end">${esc(reg.status)}</text>${[['Customer', u ? u.name : ''], ['Registration ID', reg.id], ['Date', e.dateLong], ['Session', s.name], ['Time', s.tShort]].map((f, i) => `<text x="28" y="${124 + i * 40}" font-size="11" fill="#6a5a60">${f[0]}</text><text x="28" y="${142 + i * 40}" font-size="16" font-weight="700" fill="#252525">${esc(f[1])}</text>`).join('')}${q}<text x="505" y="304" font-size="11" fill="#6a5a60" text-anchor="middle">${reg.id}</text></svg>`;
}
