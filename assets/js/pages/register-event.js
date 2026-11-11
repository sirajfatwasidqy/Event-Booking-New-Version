/* register-event.js — Event registration — step 1 (participants, session, terms) */
'use strict';

V.reg1 = () => {
  const e = regEvent();
  if (!e.sessions) { toast('Registration is not available for this event yet.'); return setTimeout(() => go('/event/' + e.id), 0), ''; }
  if (regFor(e.id)) return setTimeout(() => go('/ticket/' + regFor(e.id).id), 0), '';
  const d = S.draft, err = d.err, sess = e.sessions.find(x => x.id === d.session);
  POST = null;
  return `<div class="container page">${crumbs([['Events', '/events'], [esc(e.short), '/event/' + e.id], ['Event Registration']])}<div class="page-h"><div><h1>Event Registration</h1><p>${esc(e.title)} · ${e.dateLong}</p></div></div>${stepBar(1)}
  <div class="split"><div class="card card-pad"><h2 style="font-size:22px;margin-bottom:22px">Event & Session</h2>
  <div class="fld"><label>Number of Participants <i style="font-style:normal;color:var(--bur)">*</i></label><div class="qty" role="group" aria-label="Number of participants"><button data-act="pminus" aria-label="Decrease" ${d.participants <= 1 ? 'disabled' : ''}>${ic('minus')}</button><output aria-live="polite">${d.participants}</output><button data-act="pplus" aria-label="Increase" ${d.participants >= 5 ? 'disabled' : ''}>${ic('plus')}</button></div><div class="hint mu">Maximum 5 participants per registration</div></div>
  <div class="fld"><label for="edate">Event Date <i style="font-style:normal;color:var(--bur)">*</i></label><div class="inp"><span class="ic">${ic('cal')}</span><div class="sel-wrap"><select id="edate" class="sel" style="width:100%;border:0;outline:0"><option>${e.dateLong}</option></select>${ic('chevd')}</div></div></div>
  <div class="fld"><label>Session Selection <i style="font-style:normal;color:var(--bur)">*</i></label><div class="grid g2" style="gap:12px" role="radiogroup">${e.sessions.map(s => `<button class="sess ${d.session === s.id ? 'on' : ''}" role="radio" aria-checked="${d.session === s.id}" data-act="pickSession" data-s="${s.id}" data-r="1"><span class="rd">${ic('check')}</span><span><b>${s.name}</b><small>${s.time}</small></span><span class="av">available</span></button>`).join('')}</div>${err && !d.session ? '<div class="hint bad">Please select a session</div>' : ''}</div>
  <div class="fld"><label for="tsel">Time Selection <i style="font-style:normal;color:var(--bur)">*</i></label><div class="inp ${err && !d.session ? 'bad' : ''}"><span class="ic">${ic('clock')}</span><div class="sel-wrap"><select id="tsel" class="sel" style="width:100%;border:0;outline:0"><option value="">Select time</option>${e.sessions.map(s => `<option value="${s.id}" ${d.session === s.id ? 'selected' : ''}>${s.time}</option>`).join('')}</select>${ic('chevd')}</div></div></div>
  <div class="req" style="margin-bottom:14px"><b>Required fields</b>Fields marked * are required before submission.</div>
  <div class="terms ${err && !d.agreed ? 'bad' : ''}"><label class="cb"><input type="checkbox" id="agree" data-act="agree" ${d.agreed ? 'checked' : ''}><span class="bx">${ic('check')}</span>I agree to the terms and conditions for DAP event registration.</label></div>${err && !d.agreed ? '<div class="hint bad">Please accept the terms and conditions to continue</div>' : ''}
  <div class="acts" style="margin-top:26px"><a class="btn btn-o" href="${U('/event/' + (e.id))}" style="flex:0 0 auto">${ic('back')}Back</a><button class="btn btn-p btn-lg" data-act="reg1next">Continue ${ic('arrow')}</button></div></div>
  <div>${regSummary(e)}</div></div></div>`;
};
