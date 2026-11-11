/* routes.js — page registry and URL helpers. No dependencies (index.html uses it too).
   The route strings ('/event/sampoerna', '/tickets', …) are the ones the original single-page app used; they are kept for
   data already stored in the browser (notifications, "next" after login) and are mapped to real files here. */
'use strict';

const PAGES = [
  { key: 'home', file: 'home.html', re: /^\/?$|^\/home$/, path: '/home', nav: 'home', auth: 0, title: 'Home' },
  { key: 'events', file: 'events.html', re: /^\/events$/, path: '/events', nav: 'events', auth: 0, title: 'Explore Events' },
  { key: 'event', file: 'event-detail.html', re: /^\/event\/([\w-]+)$/, path: '/event/', id: 1, nav: 'events', auth: 0, title: 'Event Detail' },
  { key: 'login', file: 'login.html', re: /^\/login$/, path: '/login', nav: '', auth: 0, title: 'Login' },
  { key: 'register', file: 'register.html', re: /^\/register$/, path: '/register', nav: '', auth: 0, title: 'Participant Information' },
  { key: 'reg1', file: 'register-event.html', re: /^\/register-event\/1$/, path: '/register-event/1', nav: 'tickets', auth: 1, title: 'Event Registration · Step 1' },
  { key: 'reg2', file: 'register-event-summary.html', re: /^\/register-event\/2$/, path: '/register-event/2', nav: 'tickets', auth: 1, title: 'Event Registration · Step 2' },
  { key: 'regdone', file: 'registration-success.html', re: /^\/registration-success\/([\w-]+)$/, path: '/registration-success/', id: 1, nav: 'tickets', auth: 1, title: 'Registration Successful' },
  { key: 'tickets', file: 'tickets.html', re: /^\/tickets$/, path: '/tickets', nav: 'tickets', auth: 1, title: 'Ticket' },
  { key: 'ticket', file: 'ticket-detail.html', re: /^\/ticket\/([\w-]+)$/, path: '/ticket/', id: 1, nav: 'tickets', auth: 1, title: 'Ticket Detail' },
  { key: 'checkin', file: 'check-in.html', re: /^\/checkin\/([\w-]+)$/, path: '/checkin/', id: 1, nav: 'tickets', auth: 1, title: 'Check-in Successful' },
  { key: 'bookings', file: 'booking-history.html', re: /^\/bookings$/, path: '/bookings', nav: 'booking', auth: 1, title: 'Booking History' },
  { key: 'scanner', file: 'scanner.html', re: /^\/scanner$/, path: '/scanner', nav: 'booking', auth: 1, title: 'Scan Product Barcode' },
  { key: 'product', file: 'product-detail.html', re: /^\/product\/([\w-]+)$/, path: '/product/', id: 1, nav: 'booking', auth: 1, title: 'Product Detail' },
  { key: 'bdone', file: 'booking-success.html', re: /^\/booking-confirmed\/([\w-]+)$/, path: '/booking-confirmed/', id: 1, nav: 'booking', auth: 1, title: 'Booking Confirmed' },
  { key: 'bdetail', file: 'booking-detail.html', re: /^\/booking-detail\/([\w-]+)$/, path: '/booking-detail/', id: 1, nav: 'booking', auth: 1, title: 'Booking Detail' },
  { key: 'profile', file: 'profile.html', re: /^\/profile$/, path: '/profile', nav: 'profile', auth: 1, title: 'Profile' },
  { key: 'notes', file: 'notifications.html', re: /^\/notifications$/, path: '/notifications', nav: 'profile', auth: 1, title: 'Notification' },
  { key: 'privacy', file: 'privacy-security.html', re: /^\/privacy$/, path: '/privacy', nav: 'profile', auth: 1, title: 'Privacy & Security' },
  { key: 'cpw', file: 'change-password.html', re: /^\/change-password$/, path: '/change-password', nav: 'profile', auth: 1, title: 'Change Password' },
];
const pageByKey = key => PAGES.find(p => p.key === key);

/* '/event/sampoerna?x=1' → 'event-detail.html?id=sampoerna&x=1' */
function ecbsUrl(route) {
  const [path, qstr] = String(route || '/home').split('?');
  for (const p of PAGES) {
    const m = path.match(p.re);
    if (m) { const q = []; if (p.id) q.push('id=' + encodeURIComponent(m[1])); if (qstr) q.push(qstr); return p.file + (q.length ? '?' + q.join('&') : ''); }
  }
  return '404.html';
}
const U = ecbsUrl;
