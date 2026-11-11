/* forms.js — form field template, validation state, password rules, validators */
'use strict';

const fld = o => `<div class="fld"><label for="${o.id}">${o.label}${o.req ? ' <i>*</i>' : ''}</label><div class="inp ${o.state || ''}" id="${o.id}-w"><span class="ic">${ic(o.icon)}</span><input id="${o.id}" name="${o.id}" type="${o.type || 'text'}" ${o.ph ? `placeholder="${esc(o.ph)}"` : ''} value="${esc(o.value || '')}" autocomplete="${o.ac || 'off'}" ${o.inputmode ? `inputmode="${o.inputmode}"` : ''}>${o.pw ? `<button type="button" class="end" data-act="eye" data-t="${o.id}" aria-label="Show password" aria-pressed="false">${ic('eyeoff')}</button>` : ''}<span id="${o.id}-e"></span></div><div class="hint" id="${o.id}-h" aria-live="polite"></div></div>`;
function setState(id, state, msg, mu) {
  const w = $('#' + id + '-w'), h = $('#' + id + '-h'), e = $('#' + id + '-e');
  if (!w) return;
  w.classList.remove('ok', 'bad'); if (state) w.classList.add(state);
  if (e) e.innerHTML = state === 'ok' ? `<span class="end ok">${ic('check')}</span>` : state === 'bad' ? '<span class="end bad" style="font-weight:800">!</span>' : '';
  h.className = 'hint ' + (state || (mu ? 'mu' : '')); h.textContent = msg || '';
}
const rule = {
  len: v => v.length >= 8, upnum: v => /[A-Z]/.test(v) && /\d/.test(v), spec: v => /[^A-Za-z0-9]/.test(v)
};
const pwOk = v => rule.len(v) && rule.upnum(v) && rule.spec(v);
const VAL = {
  name: v => v.trim().length >= 3 && /^[A-Za-z .'-]+$/.test(v.trim()) ? null : 'Please enter your full name',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Invalid email format',
  phone: v => /^0\d{9,12}$/.test(normPhone(v)) ? null : 'Invalid phone number format'
};
