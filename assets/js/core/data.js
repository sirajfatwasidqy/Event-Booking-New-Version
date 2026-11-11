/* data.js — events, products and address (from the PDF) */
'use strict';

/* ===================== data (from the PDF) ===================== */
const ADDRESS = 'Jalan Senopati Dalam LOT 28 No.8B, RT.5/RW.3, Senayan, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12190';
const EVENTS = [
  {
    id: 'sampoerna', title: 'DAP × Sampoerna Exhibition', short: 'Sampoerna Exhibition', date: '2026-11-15', dateLong: '15 November 2026', dateShort: '15 Nov 2026',
    city: 'Jakarta', category: 'Exhibition', type: 'Customer Exhibition', duration: '5 days', cls: 't-sampoerna', wide: true, img: 'assets/img/event-sampoerna-banner.webp',
    card: "PT Duta Abadi Primantara's exclusive exhibition in Jakarta. Explore the latest products.",
    about: "PT Duta Abadi Primantara's exclusive customer exhibition in Jakarta. See the latest products, attend presentations, and order items online via QR Code Order.",
    schedule: [['09:00', 'Registration & Check-in'], ['10:00', 'Opening Session'], ['11:00', 'Product Exhibition'], ['13:00', 'Networking Lunch'], ['15:00', 'Closing & Item Booking']],
    sessions: [{ id: 's1', name: 'Session 1 · Morning', time: '09:00 – 12:00', tShort: '09:00–12:00' }, { id: 's2', name: 'Session 2 · Afternoon', time: '12:00 – 15:00', tShort: '12:00–15:00' }],
    address: ADDRESS
  },
  {
    id: 'gathering', title: 'DAP Customer Gathering', short: 'DAP Customer Gathering', date: '2026-12-12', dateLong: '12 December 2026', dateShort: '12 Dec 2026',
    city: 'Surabaya', category: 'Gathering', type: 'Exclusive Partner Event', cls: 't-gather', wide: false, img: 'assets/img/event-gathering.webp',
    card: 'Elevating Comfort, Honoring Partnerships',
    about: 'Elevating Comfort, Honoring Partnerships. An exclusive partner event by PT Duta Abadi Primantara — “Rest, Connect, Succeed”.',
    highlights: [['Product Launch', 'New Mattress Tech'], ['Gala & Awards', 'Partner Appreciation'], ['Dealer Promos', 'Exclusive Discounts']]
  },
  {
    id: 'showcase', title: 'DAP Product Showcase', short: 'DAP Product Showcase', date: '2027-01-20', dateLong: '20 January 2027', dateShort: '20 Jan 2027',
    city: 'Jakarta', category: 'Showcase', type: 'Exclusive', cls: 't-show', wide: false, img: 'assets/img/event-showcase.webp',
    card: 'Exclusive DAP product showcase in Jakarta.', about: 'Exclusive DAP product showcase in Jakarta.'
  }
];
const evById = id => EVENTS.find(e => e.id === id);
const PRODUCTS = [
  {
    id: 'kingkoil', brand: 'KING KOIL', name: 'KING KOIL Chiro Endorsed – Kasur Spring Bed [Mattress Only]', price: 15178000,
    unitType: 'Super King Size', size: '200 cm x 200 cm', barcode: '8901234567890', logo: 'assets/img/kingkoil-logo.webp',
    desc: "Designed to provide ergonomic support, optimal comfort, and proper spinal alignment for a restful night's sleep.",
    images: ['assets/img/kingkoil-hero.webp', 'assets/img/kingkoil-brochure-1.webp', 'assets/img/kingkoil-brochure-2.webp']
  },
  {
    id: 'serta', brand: 'SERTA', name: 'COMFORT PACKAGE SERTA – Package Mattress Vantage [Mattress Only]', price: 8204000,
    unitType: 'Package Mattress Vantage', size: null, barcode: '8901234567906', logo: 'assets/img/serta-logo.webp',
    desc: 'Work All Day, Chill All Night with 8 hours of Better Sleep.',
    images: ['assets/img/serta-package.webp', 'assets/img/serta-banner.webp']
  }
];
const prById = id => PRODUCTS.find(p => p.id === id);
