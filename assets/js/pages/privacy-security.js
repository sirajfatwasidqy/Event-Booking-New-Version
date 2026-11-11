/* privacy-security.js — Privacy & Security: login alerts and active sessions */
'use strict';

V.privacy = () => {
  POST = null;
  return `<div class="container page"><div class="acc">${side('/privacy')}<div><div class="page-h"><div><h1>Privacy & Security</h1></div></div>
  <div class="shield"><span class="ic">${ic('shield')}</span><div><b>Your account is protected</b><small>Last password update: ${S.pwUpdated ? S.pwUpdated : '-'}</small></div></div>
  <div class="grp"><b class="eyebrow" style="color:#6a5a60">Account Security</b></div><div class="card card-pad" style="padding-top:8px;padding-bottom:8px"><div class="menu-list"><a href="${U('/change-password')}"><span class="ic">${ic('key')}</span><span><b>Change Password</b><small>Last updated ${S.pwUpdated ? S.pwUpdated : '-'}</small></span><span class="go">${ic('chev')}</span></a></div></div>
  <div class="grp"><b class="eyebrow" style="color:#6a5a60">Login Security</b></div><div class="card card-pad" style="padding-top:8px;padding-bottom:8px"><div class="menu-list"><div style="display:flex;align-items:center;gap:14px;padding:18px 4px"><span class="ic">${ic('bell')}</span><span><b>Login Alerts</b><small>Notify me of new device sign-ins</small></span><button class="tg ${S.loginAlerts ? 'on' : ''}" role="switch" aria-checked="${S.loginAlerts}" aria-label="Login Alerts" data-act="toggleAlerts" style="margin-left:auto"></button></div>
  <button data-act="sessions"><span class="ic">${ic('dev')}</span><span><b>Active Sessions</b><small>1 device signed in</small></span><span class="go">${ic('chev')}</span></button></div></div></div></div></div>`;
};
