/* actions.js — click actions (data-act) shared by all pages */
'use strict';

function startReg(id) {
  const e = evById(id);
  if (!e.sessions) { toast('Registration is not available for this event yet.'); return go('/event/' + id); }
  S.ctx = id;
  if (!isAuth()) { S.next = '/register-event/1'; save(); return go('/login'); }
  const r = regFor(id); if (r) { save(); return go('/ticket/' + r.id); }
  save(); go('/register-event/1');
}
function deviceInfo() { const ua = navigator.userAgent; const os = /Windows/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Mac OS/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown OS'; const br = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Browser'; return br + ' on ' + os; }
function setBusy(b, label) { b.disabled = true; b.innerHTML = '<span class="spin"></span>' + label; }

function act(name, el, ev) {
  const id = el.dataset.id;
  switch (name) {
    case 'menu': { const m = $('#acm'); const o = !m.classList.contains('open'); m.classList.toggle('open', o); el.setAttribute('aria-expanded', o); ev.stopPropagation(); break; }
    case 'eye': { const i = $('#' + el.dataset.t); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; el.innerHTML = ic(show ? 'eye' : 'eyeoff'); el.setAttribute('aria-pressed', show); el.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); i.focus(); break; }
    case 'forgot': modal(`<h3>Forgot Password?</h3><p>Enter your email address and we will send reset instructions.</p><form id="ff" novalidate>${fld({ id: 'fe', label: 'Email', icon: 'mail', type: 'email', ph: 'name@example.com' })}<div class="acts"><button type="button" class="btn btn-o" data-close>Cancel</button><button class="btn btn-p" type="submit">Send</button></div></form>`);
      $('#ff').addEventListener('submit', e => { e.preventDefault(); const v = $('#fe').value; const m = VAL.email(v); if (m) return setState('fe', 'bad', m); closeModal(); toast('If this email is registered, reset instructions will be sent.', 'ok'); }); break;
    case 'register': startReg(id); ev.stopPropagation(); break;
    case 'pickSession': S.draft.session = el.dataset.s; S.draft.err = false; save(); rerender(); break;
    case 'pminus': S.draft.participants = Math.max(1, S.draft.participants - 1); save(); rerender(); break;
    case 'pplus': S.draft.participants = Math.min(5, S.draft.participants + 1); save(); rerender(); break;
    case 'agree': S.draft.agreed = el.checked; save(); if (el.checked) { S.draft.err = S.draft.err && !S.draft.session; } rerender(); break;
    case 'reg1next': if (!S.draft.session || !S.draft.agreed) { S.draft.err = true; save(); rerender(); const b = $('.hint.bad, .inp.bad, .terms.bad'); if (b) b.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; } S.draft.err = false; save(); go('/register-event/2'); break;
    case 'reg2confirm': {
      setBusy(el, 'Processing…');
      setTimeout(() => {
        const e = regEvent(), d = S.draft, rid = nextId('reg'), s = e.sessions.find(x => x.id === d.session);
        S.regs.push({ id: rid, eventId: e.id, session: d.session, participants: d.participants, status: 'Registered', created: new Date().toISOString() });
        addNote('event', '', 'ticket', 'Registration Complete', `You are registered for ${e.short} on ${e.dateLong}.`, '/ticket/' + rid);
        addNote('event', '', 'clock', 'Event Reminder', reminderText(e, s), '/event/' + e.id);
        addAct('Registration for ' + e.short); S.draft = { participants: 1, session: null, agreed: false }; save(); go('/registration-success/' + rid);
      }, 700); break;
    }
    case 'dlTicket': { const r = S.regs.find(x => x.id === id); download(`ticket-${id}.svg`, ticketSvg(r), 'image/svg+xml'); toast('Ticket downloaded', 'ok'); break; }
    case 'addCal': { const r = S.regs.find(x => x.id === id); download(`${id}.ics`, icsFor(r), 'text/calendar'); toast('Calendar file downloaded', 'ok'); break; }
    case 'bigQr': modal(`<h3>Check-in QR Code</h3><p>Show this code at the event entrance.</p><div class="qrbig">${qrBox(id)}</div><div style="text-align:center;margin-bottom:20px"><span class="id-pill">${id}</span></div><div class="acts"><button class="btn btn-p" data-close>Close</button></div>`, 'lg'); break;
    case 'simCheckin': toast('Ticket scanned at the entrance', 'ok'); go('/checkin/' + id); break;
    case 'sim': window.__sim(); break;
    case 'addBooking': {
      const p = prById(id), qty = Math.min(5, Math.max(1, parseInt(($('#qv') || {}).textContent, 10) || 1));
      setBusy(el, 'Processing…');
      setTimeout(() => {
        const bid = nextId('bkg');
        S.bookings.unshift({ id: bid, productId: p.id, qty, eventId: 'sampoerna', status: 'Confirmed', created: new Date().toISOString() });
        addNote('booking', 'ok', 'check', 'Booking Confirmed', `Your booking ${bid} for ${plural(qty, 'item')} (${p.brand}) has been confirmed.`, '/booking-detail/' + bid);
        addNote('booking', '', 'bag', 'Pickup Reminder', `Show your QR code to the POS staff to collect booking ${bid}.`, '/booking-detail/' + bid);
        addAct(`Booking ${p.brand} Mattress Booking Confirmed`); save(); go('/booking-confirmed/' + bid);
      }, 700); break;
    }
    case 'dlBooking': {
      const b = S.bookings.find(x => x.id === id), p = prById(b.productId), e = evById(b.eventId);
      download(`${id}-confirmation.txt`, ['EVENT BOOKING — BOOKING CONFIRMATION', 'PT Duta Abadi Primantara', '', `Booking ID : ${b.id}`, `Status     : ${b.status}`, `Event      : ${e.title} (${e.dateLong})`, `Product    : ${p.name}`, `Size       : ${p.size || '-'}`, `Quantity   : ${b.qty}`, `Total      : ${rp(p.price * b.qty)}`, `Lot/Serial : Assigned at POS`, `Customer   : ${me().name}`, '', 'Present the QR code for this Booking ID at the event POS to complete your order.'].join('\n'));
      toast('Confirmation downloaded', 'ok'); break;
    }
    case 'edit': if (el.dataset.k === 'all') EDIT = new Set(['name', 'email', 'phone']); else EDIT.add(el.dataset.k); rerender(); { const f = $('[id^="e-"]:not([id$="-w"]):not([id$="-h"])'); if (f) f.focus(); } break;
    case 'cancelEdit': EDIT = new Set(); rerender(); break;
    case 'saveEdit': {
      const u = me(); let ok = true; const nv = {};
      [...EDIT].forEach(k => {
        const i = $('#e-' + k), h = $('#e-' + k + '-h'), w = $('#e-' + k + '-w'); let m = VAL[k](i.value);
        if (!m && k !== 'name') { const o = findUser(i.value); if (o && o.id !== u.id) m = k === 'email' ? 'This email is already registered' : 'This phone number is already registered'; }
        w.classList.toggle('bad', !!m); h.className = 'hint bad'; h.textContent = m || ''; if (m) ok = false; else nv[k] = i.value.trim();
      });
      if (!ok) { toast('Please fix the highlighted fields', 'bad'); break; }
      Object.assign(u, nv); EDIT = new Set(); save(); rerender(); renderChrome(); toast('Profile updated', 'ok'); break;
    }
    case 'logout': modal(`<h3>Log out?</h3><p>You will need to sign in again to access your tickets and bookings.</p><div class="acts"><button class="btn btn-o" data-close>Cancel</button><button class="btn btn-d" data-act="doLogout">${ic('out')}Log Out</button></div>`); break;
    case 'doLogout': S.session = null; try { sessionStorage.removeItem('ecbs.active'); } catch (e) { /* ignore */ } save(); closeModal(); toast('You have been logged out', 'ok'); go('/home'); break;
    case 'openNote': { const n = S.notes.find(x => String(x.id) === id); if (n) { n.read = true; save(); go(n.link); } break; }
    case 'readAll': S.notes.forEach(n => n.read = true); save(); window.__ndraw(); renderChrome(); toast('All notifications marked as read', 'ok'); break;
    case 'toggleAlerts': S.loginAlerts = !S.loginAlerts; save(); rerender(); toast('Login alerts ' + (S.loginAlerts ? 'enabled' : 'disabled')); break;
    case 'sessions': modal(`<h3>Active Sessions</h3><p>1 device signed in.</p><div class="sess-li"><span class="ic">${ic('dev')}</span><div style="flex:1"><b>${esc(deviceInfo())}</b><div class="tiny muted">This device · signed in as ${esc(me().email)}</div></div><span class="st">Current</span></div><div class="acts" style="margin-top:12px"><button class="btn btn-p" data-close>Close</button></div>`); break;
    case 'clearSearch': window.__clearSearch(); break;
    case 'demo': modal(`<h3>Demo tools</h3><p>Load the sample data from the design (registration REG-2026-001, two bookings and four notifications), or clear everything stored in this browser.</p><div class="acts"><button class="btn btn-p" data-act="loadDemo">Load sample data</button><button class="btn btn-d" data-act="resetDemo">Reset all data</button></div><div class="acts" style="margin-top:12px"><button class="btn btn-o" data-close>Close</button></div>`); break;
    case 'loadDemo': loadSample(); closeModal(); toast('Sample data loaded', 'ok'); go('/tickets'); renderChrome(); break;
    case 'resetDemo': try { localStorage.removeItem(KEY); sessionStorage.removeItem('ecbs.active'); } catch (e) { /* ignore */ } S = fresh(); closeModal(); toast('Data cleared'); go('/home'); renderChrome(); break;
  }
}
