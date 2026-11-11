/* register.js — Participant account registration with live validation */
'use strict';

V.register = () => {
  const ctx = S.ctx ? evById(S.ctx) : null;
  const FK = ['rname', 'remail', 'rphone', 'rpw', 'rpw2'];
  POST = () => {
    const chk = k => {
      const v = $('#' + k).value; let m = null;
      if (k === 'rname') m = VAL.name(v); if (k === 'remail') { m = VAL.email(v); if (!m && findUser(v)) m = 'This email is already registered'; }
      if (k === 'rphone') { m = VAL.phone(v); if (!m && findUser(v)) m = 'This phone number is already registered'; }
      if (k === 'rpw') m = pwOk(v) ? null : 'Use at least 8 characters with an uppercase letter, a number and a special character';
      if (k === 'rpw2') m = v && v === $('#rpw').value ? null : 'Passwords do not match';
      if (!v && !m) m = 'This field is required';
      setState(k, m ? 'bad' : 'ok', m || (k === 'rname' ? 'Verified' : ''));
      return !m;
    };
    FK.forEach(k => { $('#' + k).addEventListener('blur', () => chk(k)); $('#' + k).addEventListener('input', () => { if ($('#' + k + '-w').classList.contains('bad') || $('#' + k + '-w').classList.contains('ok')) chk(k); if (k === 'rpw' && $('#rpw2').value) chk('rpw2'); }); });
    $('#rf').addEventListener('submit', ev => {
      ev.preventDefault(); const r = FK.map(chk);
      if (!r.every(Boolean)) { const f = FK[r.indexOf(false)]; $('#' + f).focus(); return; }
      const b = $('#rbtn'); b.disabled = true; b.innerHTML = '<span class="spin"></span>Processing…';
      setTimeout(() => {
        S.seq.cus++; const u = { id: 'CUS-2026-0' + S.seq.cus, name: $('#rname').value.trim(), email: $('#remail').value.trim(), phone: $('#rphone').value.trim(), password: $('#rpw').value };
        S.users.push(u); S.session = { uid: u.id, remember: true }; try { sessionStorage.setItem('ecbs.active', '1'); } catch (e) { /* ignore */ }
        const nx = S.next || (S.ctx ? '/register-event/1' : '/home'); S.next = null; save(); toast('Account created. Welcome, ' + u.name.split(' ')[0] + '!', 'ok'); go(nx);
      }, 700);
    });
  };
  return `<div class="auth"><section class="auth-l"><span class="logo-pill"><img src="${brandLogo}" alt="DAP"></span><div class="eyebrow" style="color:#fff;opacity:.75;margin-bottom:12px">Event Registration</div><h1>Participant<br><em>Information</em></h1><p>Create your participant account to register for events, receive digital tickets, and book items.</p>${ctx ? `<span class="ctx-chip">${esc(ctx.title)} · ${ctx.dateLong}</span>` : ''}</section>
  <section class="auth-r"><div class="auth-box"><h2>Create your account</h2><p>Fields marked * are required.</p><form id="rf" novalidate>
  ${fld({ id: 'rname', label: 'Full Name', req: 1, icon: 'user', ph: 'Your full name', ac: 'name' })}${fld({ id: 'remail', label: 'Email', req: 1, icon: 'mail', type: 'email', ph: 'name@example.com', ac: 'email' })}${fld({ id: 'rphone', label: 'Phone Number', req: 1, icon: 'phone', type: 'tel', ph: '+62 812-3456-7890', ac: 'tel', inputmode: 'tel' })}
  ${fld({ id: 'rpw', label: 'Password', req: 1, icon: 'lock', type: 'password', pw: 1, ph: 'Create a password', ac: 'new-password' })}${fld({ id: 'rpw2', label: 'Repeat Password', req: 1, icon: 'lock', type: 'password', pw: 1, ph: 'Repeat your password', ac: 'new-password' })}
  <button class="btn btn-p btn-lg btn-block" id="rbtn" type="submit" style="margin-top:6px">Continue</button></form><p class="alt">Already have an account? <a class="link" href="${U('/login')}">Login</a></p></div></section></div>`;
};
