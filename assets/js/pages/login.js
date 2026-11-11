/* login.js — Login with validation and redirect to the page that required it */
'use strict';

V.login = () => {
  const ctx = S.ctx ? evById(S.ctx) : null;
  POST = () => {
    const id = $('#lid'), pw = $('#lpw');
    id.addEventListener('input', () => { const u = findUser(id.value); if (!id.value.trim()) setState('lid', '', ''); else if (u) setState('lid', 'ok', /@/.test(id.value) ? 'Email is recognized' : 'Phone number is recognized'); else setState('lid', '', ''); });
    pw.addEventListener('input', () => setState('lpw', '', ''));
    $('#lf').addEventListener('submit', ev => {
      ev.preventDefault(); let bad = false;
      const u = findUser(id.value);
      if (!id.value.trim()) { setState('lid', 'bad', 'Please enter your email or phone number'); bad = true; } else if (!u) { setState('lid', 'bad', 'Account not found. Please check your email or phone number.'); bad = true; }
      if (!pw.value) { setState('lpw', 'bad', 'Please enter your password'); bad = true; } else if (u && u.password !== pw.value) { setState('lpw', 'bad', 'The password does not match. Please try again.'); bad = true; }
      if (bad) return;
      const b = $('#lbtn'); b.disabled = true; b.innerHTML = '<span class="spin"></span>Processing…';
      setTimeout(() => {
        b.classList.replace('btn-p', 'btn-g'); b.innerHTML = ic('check') + 'Succeed';
        S.session = { uid: u.id, remember: $('#rem').checked }; try { sessionStorage.setItem('ecbs.active', '1'); } catch (e) { /* ignore */ }
        const nx = S.next; S.next = null; save();
        if (S.loginAlerts) toast('Signed in as ' + u.name, 'ok');
        setTimeout(() => go(nx || '/home'), 550);
      }, 800);
    });
  };
  return `<div class="auth"><section class="auth-l"><span class="logo-pill"><img src="${brandLogo}" alt="DAP — Duta Abadi Primantara"></span><h1>Event, registration,<br><em>and booking in one place.</em></h1><p>Sign in to manage your events and bookings.</p>${ctx ? `<span class="ctx-chip">${esc(ctx.title)} · ${ctx.dateLong}</span>` : ''}</section>
  <section class="auth-r"><div class="auth-box"><h2>Welcome</h2><p>Sign in to manage your events and bookings.</p>
  <form id="lf" novalidate>${fld({ id: 'lid', label: 'Email or Phone Number', icon: 'mail', ph: 'Email or phone number', ac: 'username' })}${fld({ id: 'lpw', label: 'Password', req: 1, icon: 'lock', type: 'password', pw: 1, ph: 'Enter your password', ac: 'current-password' })}
  <div class="rowx"><label class="cb"><input type="checkbox" id="rem" checked><span class="bx">${ic('check')}</span>Remember Me</label><button type="button" class="link" data-act="forgot">Forgot Password?</button></div>
  <button class="btn btn-p btn-lg btn-block" id="lbtn" type="submit">Login</button></form>
  <a class="btn btn-o btn-lg btn-block" href="${U('/register')}" style="margin-top:12px">Register</a>
  <div class="demo-note"><b>Demo account</b> — ${esc(DEMO.email)} · password <b>${esc(DEMO.password)}</b></div></div></section></div>`;
};
