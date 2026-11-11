/* chrome.js — header, footer and mobile bottom navigation */
'use strict';

const NAV = [['home', '/home', 'Home', 'home'], ['events', '/events', 'Events', 'search'], ['tickets', '/tickets', 'Ticket', 'ticket'], ['booking', '/bookings', 'Booking', 'box'], ['profile', '/profile', 'Profile', 'user']];

function renderChrome() {
  const u = me(), un = unread();
  $('#hdr').innerHTML = `<div class="container"><a class="brand" href="${U('/home')}" aria-label="Event Booking — Home"><img src="${brandLogo}" alt="DAP — Duta Abadi Primantara"><span><b>Event Booking</b><small>PT Duta Abadi Primantara</small></span></a>
  <nav class="nav" aria-label="Main">${NAV.map(n => `<a href="${U((n[1]))}" class="${CUR === n[0] ? 'on' : ''}" ${CUR === n[0] ? 'aria-current="page"' : ''}>${ic(n[3])}${n[2]}</a>`).join('')}</nav>
  <div class="hdr-r"><form class="hsearch" id="hform" role="search">${ic('search')}<input id="hq" placeholder="Search events..." aria-label="Search events"></form>
  ${u ? `<a class="icon-btn" href="${U('/notifications')}" aria-label="Notifications${un ? ', ' + un + ' unread' : ''}">${ic('bell')}${un ? '<span class="dot"></span>' : ''}</a><div class="acct"><button class="acct-btn" data-act="menu" aria-haspopup="true" aria-expanded="false"><span class="avatar">${esc(initials(u.name))}</span><span>${esc(u.name.split(' ')[0])}</span>${ic('chevd')}</button>
  <div class="menu" id="acm" role="menu"><div class="who"><b>${esc(u.name)}</b>${esc(u.email)}</div><div class="sep"></div><a href="${U('/profile')}" role="menuitem">${ic('user')}Profile</a><a href="${U('/notifications')}" role="menuitem">${ic('bell')}Notification</a><a href="${U('/privacy')}" role="menuitem">${ic('shield')}Privacy & Security</a><div class="sep"></div><button class="danger" data-act="logout" role="menuitem">${ic('out')}Log Out</button></div></div>`
      : `<a class="btn btn-o btn-sm" href="${U('/register')}" style="height:44px">Register</a><a class="btn btn-p btn-sm" href="${U('/login')}" style="height:44px">Login</a>`}</div></div>`;
  $('#hform').addEventListener('submit', e => { e.preventDefault(); const v = $('#hq').value.trim(); go('/events' + (v ? '?q=' + encodeURIComponent(v) : '')); });
  $('#bnav').innerHTML = NAV.map(n => `<a href="${U((n[1]))}" class="${CUR === n[0] ? 'on' : ''}">${ic(n[3])}${n[2]}</a>`).join('');
  if (!$('#ftr').firstElementChild) renderFooter();
}

function renderFooter() {
  $('#ftr').innerHTML = `<div class="container"><div><span class="logo-pill"><img src="${brandLogo}" alt="DAP — Duta Abadi Primantara"></span><p class="tag">“Rest, Connect, Succeed”</p></div>
<div><h4>Quick Links</h4><ul><li><a href="${U('/home')}">Home</a></li><li><a href="${U('/events')}">Events</a></li><li><a href="${U('/tickets')}">Ticket</a></li><li><a href="${U('/bookings')}">Booking</a></li><li><a href="${U('/profile')}">Profile</a></li></ul></div>
<div><h4>Event Booking Application</h4><ul><li><a href="${U('/events')}">Explore Events</a></li><li><a href="${U('/scanner')}">Scan Product Barcode</a></li><li><a href="${U('/bookings')}">Booking History</a></li></ul></div>
<div><h4>Account</h4><ul><li><a href="${U('/login')}">Login</a></li><li><a href="${U('/register')}">Register</a></li><li><a href="${U('/notifications')}">Notification</a></li><li><a href="${U('/privacy')}">Privacy & Security</a></li></ul></div></div>
<div class="copy"><div class="container"><span>© 2026 PT Duta Abadi Primantara. All rights reserved.</span><button class="demo-btn" data-act="demo">Demo tools</button></div></div>`;
}
