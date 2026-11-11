/* state.js — application state persisted in localStorage (prototype data) */
'use strict';

/* ===================== state ===================== */
const KEY = 'ecbs.v1';
const DEMO = { id: 'CUS-2026-0187', name: 'Siraj Fatwa Sidqy', email: 'siraj.fatwa@example.com', phone: '+62 812-3456-7890', password: 'Demo@2026' };
const fresh = () => ({ users: [{ ...DEMO }], session: null, next: null, ctx: null, regs: [], bookings: [], notes: [], acts: [], draft: { participants: 1, session: null, agreed: false }, loginAlerts: true, pwUpdated: null, seq: { reg: 0, bkg: 0, cus: 187 }, scanIdx: 0 });
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
if (!S.users || !S.users.length) S.users = [{ ...DEMO }];
if (S.session && !S.session.remember) { try { if (!sessionStorage.getItem('ecbs.active')) S.session = null; } catch (e) { /* ignore */ } }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } };
const me = () => S.session ? S.users.find(u => u.id === S.session.uid) : null;
const isAuth = () => !!me();
const nextId = k => { S.seq[k]++; return (k === 'reg' ? 'REG-2026-' : 'BKG-2026-') + String(S.seq[k]).padStart(3, '0'); };
const normPhone = p => { let d = String(p).replace(/[^\d+]/g, ''); if (d.startsWith('+62')) d = '0' + d.slice(3); else if (d.startsWith('62')) d = '0' + d.slice(2); return d; };
const findUser = id => { const v = String(id).trim().toLowerCase(); if (!v) return null; return S.users.find(u => u.email.toLowerCase() === v || (/\d{6,}/.test(v) && normPhone(u.phone) === normPhone(v))) || null; };
const addNote = (type, kind, icon, title, msg, link) => { S.notes.unshift({ id: Date.now() + Math.random(), type, kind, icon, title, msg, time: fmtClock(new Date()), read: false, link }); };
const addAct = title => { S.acts.unshift({ title, time: fmtDT(new Date()) }); };
const unread = () => S.notes.filter(n => !n.read).length;
const myRegs = () => S.regs;
const regFor = evId => S.regs.find(r => r.eventId === evId);
const daysTo = iso => { const t = new Date(iso + 'T00:00:00'); const n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 86400000); };
const reminderText = (e, sess) => { const d = daysTo(e.date); const when = d > 1 ? `starts in ${d} days` : d === 1 ? 'starts tomorrow' : d === 0 ? 'starts today' : `was held on ${e.dateLong}`; return `${e.short} ${when} · ${sess.name.split(' · ')[0]}, ${sess.tShort}.`; };

function loadSample() {
  const u = S.users.find(x => x.id === DEMO.id) || (S.users.unshift({ ...DEMO }), S.users[0]);
  S.session = { uid: u.id, remember: true };
  const sess = evById('sampoerna').sessions[1];
  S.regs = [{ id: 'REG-2026-001', eventId: 'sampoerna', session: 's2', participants: 1, status: 'Registered', created: new Date().toISOString() }];
  S.bookings = [
    { id: 'BKG-2026-001', productId: 'kingkoil', qty: 1, eventId: 'sampoerna', status: 'Confirmed', created: new Date().toISOString() },
    { id: 'BKG-2026-002', productId: 'serta', qty: 1, eventId: 'sampoerna', status: 'Confirmed', created: new Date().toISOString() }
  ];
  S.seq.reg = 1; S.seq.bkg = 2;
  S.notes = [
    { id: 1, type: 'booking', kind: 'ok', icon: 'check', title: 'Booking Confirmed', msg: 'Your booking BKG-2026-001 for 1 Super King Size mattress has been confirmed.', time: '9:30 AM', read: false, link: '/booking-detail/BKG-2026-001' },
    { id: 2, type: 'booking', kind: '', icon: 'bag', title: 'Pickup Reminder', msg: 'Show your QR code to the POS staff to collect booking BKG-2026-001.', time: '2 Nov', read: true, link: '/booking-detail/BKG-2026-001' },
    { id: 3, type: 'event', kind: '', icon: 'clock', title: 'Event Reminder', msg: reminderText(evById('sampoerna'), sess), time: 'Yesterday', read: true, link: '/event/sampoerna' },
    { id: 4, type: 'event', kind: '', icon: 'ticket', title: 'Registration Complete', msg: 'You are registered for Sampoerna Exhibition on 15 November 2026.', time: '8:15 AM', read: false, link: '/ticket/REG-2026-001' }
  ];
  S.acts = [{ title: 'Booking KING KOIL Mattress Booking Confirmed', time: '15 Nov 2026, 13:40' }, { title: 'Registration for Sampoerna Exhibition', time: '15 Nov 2026, 12:00' }];
  save();
}
