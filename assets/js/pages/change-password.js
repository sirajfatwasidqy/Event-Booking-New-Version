/* change-password.js — Change Password with strength meter and rules */
'use strict';

V.cpw = () => {
  POST = () => {
    const c = $('#cp0'), n = $('#cp1'), m = $('#cp2');
    const strength = v => { let s = 0; if (rule.len(v)) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/\d/.test(v)) s++; if (rule.spec(v)) s++; if (v.length >= 12 && s >= 4) s = 4; return v ? Math.max(s, 1) : 0; };
    const upd = () => {
      const v = n.value, s = strength(v), lab = ['', 'Weak', 'Fair', 'Good', 'Strong'][s], cls = s <= 1 ? 'w' : s <= 2 ? 'm' : 'on';
      $$('#meter i').forEach((i, k) => { i.className = k < s ? cls : ''; }); $('#mlab').textContent = lab; $('#mlab').style.color = s <= 1 ? 'var(--bad)' : s <= 2 ? '#a8741a' : 'var(--ok)';
      [['q1', rule.len(v)], ['q2', rule.upnum(v)], ['q3', rule.spec(v)]].forEach(([id, ok]) => $('#' + id).classList.toggle('ok', ok));
      if (m.value) { m.value === v ? setState('cp2', 'ok', 'Passwords match') : setState('cp2', 'bad', 'Passwords do not match'); }
    };
    n.addEventListener('input', upd); m.addEventListener('input', upd); c.addEventListener('input', () => setState('cp0', '', ''));
    $('#cf').addEventListener('submit', ev => {
      ev.preventDefault(); const u = me(); let bad = false;
      if (!c.value) { setState('cp0', 'bad', 'Please enter your current password'); bad = true; } else if (c.value !== u.password) { setState('cp0', 'bad', 'Current password is incorrect'); bad = true; }
      if (!pwOk(n.value)) { setState('cp1', 'bad', 'New password does not meet the requirements'); bad = true; } else if (n.value === u.password) { setState('cp1', 'bad', 'New password must be different from your current password'); bad = true; } else setState('cp1', '', '');
      if (!m.value || m.value !== n.value) { setState('cp2', 'bad', 'Passwords do not match'); bad = true; }
      if (bad) return;
      const b = $('#cbtn'); b.disabled = true; b.innerHTML = '<span class="spin"></span>Processing…';
      setTimeout(() => { u.password = n.value; S.pwUpdated = fmtDate(new Date()); save(); b.classList.replace('btn-p', 'btn-g'); b.innerHTML = ic('check') + 'Succeed'; toast('Password updated successfully', 'ok'); setTimeout(() => go('/privacy'), 900); }, 800);
    });
    upd();
  };
  return `<div class="container page"><div class="acc">${side('/privacy')}<div><div class="page-h"><div><h1>Change Password</h1><p>Create a strong password that you do not use on other accounts.</p></div></div><form id="cf" class="card card-pad" novalidate style="max-width:640px">
  ${fld({ id: 'cp0', label: 'Current Password', icon: 'lock', type: 'password', pw: 1, ac: 'current-password' })}${fld({ id: 'cp1', label: 'New Password', icon: 'lock', type: 'password', pw: 1, ac: 'new-password' })}
  <div class="meter" id="meter" aria-hidden="true"><i></i><i></i><i></i><i></i><b id="mlab"></b></div>
  <div class="rq"><div id="q1"><i>${ic('check')}</i>At least 8 characters</div><div id="q2"><i>${ic('check')}</i>One uppercase letter and one number</div><div id="q3"><i>${ic('check')}</i>One special character</div></div>
  <div style="margin-top:22px">${fld({ id: 'cp2', label: 'Confirm Password', icon: 'lock', type: 'password', pw: 1, ac: 'new-password' })}</div>
  <div class="callout" style="margin:6px 0 24px">${ic('shield')}<span><b>For your security</b><br>Create a strong password that you do not use on other accounts.</span></div>
  <button class="btn btn-p btn-lg btn-block" id="cbtn" type="submit">${ic('lock')}Update Password</button></form></div></div></div>`;
};
