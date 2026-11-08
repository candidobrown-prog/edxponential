/* BetterEd School Health Index app: accounts (Supabase Auth), bot check (Cloudflare Turnstile),
   school lookups (NCES directory, one JSON file per state), autosave and submission.
   Loaded only on /school-health-index/ app pages. No build step, no framework. */
(function () {
  'use strict';
  var cfgEl = document.getElementById('shi-config');
  if (!cfgEl) return;
  var cfg = JSON.parse(cfgEl.textContent);
  var ready = !!(cfg.url && cfg.key && window.supabase);
  var sb = ready ? window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
  var go = function (path) { window.location.assign(cfg.base + path); };

  /* ---------- small helpers ---------- */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  function setErr(id, msg) {
    var f = document.querySelector('[data-field="' + id + '"]'); var e = document.getElementById(id + '-err'); var c = document.getElementById(id);
    if (f) f.classList.toggle('has-error', !!msg);
    if (e) e.textContent = msg || '';
    if (c && c.setAttribute) { if (msg) c.setAttribute('aria-invalid', 'true'); else c.removeAttribute('aria-invalid'); }
    return !msg;
  }
  function clearErrs(form) { $$('.has-error', form).forEach(function (f) { setErr(f.getAttribute('data-field'), ''); }); }
  function status(form, kind, html) {
    var s = $('[data-status]', form); if (!s) return;
    s.hidden = !html; s.className = 'form-status' + (kind ? ' is-' + kind : ''); s.innerHTML = html || '';
  }
  function busy(form, on) { var b = $('button[type="submit"]', form); if (b) { b.setAttribute('aria-disabled', on ? 'true' : 'false'); b.disabled = !!on; } }
  var val = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  var emailOk = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  function friendly(error) {
    var m = (error && error.message || '').toLowerCase();
    if (m.indexOf('already registered') > -1 || m.indexOf('already been registered') > -1) return 'An account with this email already exists. <a href="' + cfg.base + 'sign-in/">Sign in instead</a>.';
    if (m.indexOf('invalid login') > -1) return 'That email and password do not match. Try again, or use "Forgot your password?".';
    if (m.indexOf('not confirmed') > -1) return 'Please confirm your email first. Check your inbox for the link we sent.';
    if (m.indexOf('captcha') > -1) return 'The security check did not go through. Please complete it again.';
    if (m.indexOf('rate limit') > -1 || m.indexOf('too many') > -1) return 'Too many attempts. Please wait a few minutes and try again.';
    if (m.indexOf('password') > -1 && m.indexOf('weak') > -1) return 'Please choose a stronger password.';
    return 'Something went wrong on our side. Please try again, or email <a href="mailto:info@betteredsolutions.org">info@betteredsolutions.org</a>.';
  }

  /* Clear a field's error as soon as the person fixes it */
  $$('form[data-shi-form]').forEach(function (f) {
    var clear = function (e) { var t = e.target; if (t && t.id && document.getElementById(t.id + '-err')) setErr(t.id, ''); };
    f.addEventListener('input', clear); f.addEventListener('change', clear);
  });

  /* Show / hide password */
  $$('[data-show-pw]').forEach(function (b) {
    b.addEventListener('click', function () {
      var i = document.getElementById(b.getAttribute('data-show-pw')); var show = i.type === 'password';
      i.type = show ? 'text' : 'password'; b.textContent = show ? 'Hide' : 'Show';
    });
  });

  /* ---------- Cloudflare Turnstile ---------- */
  var ts = { token: null, id: null };
  function initTurnstile(form) {
    var el = $('[data-turnstile]', form); if (!el) return;
    if (!cfg.turnstile) { el.parentNode.hidden = true; return; }
    var render = function () {
      ts.id = window.turnstile.render(el, {
        sitekey: cfg.turnstile, theme: 'light',
        callback: function (t) { ts.token = t; var e = $('[data-turnstile-err]', form); if (e) e.textContent = ''; },
        'expired-callback': function () { ts.token = null; },
        'error-callback': function () { ts.token = null; },
      });
    };
    if (window.turnstile) render(); else { var tries = 0; var iv = setInterval(function () { if (window.turnstile) { clearInterval(iv); render(); } else if (++tries > 100) clearInterval(iv); }, 150); }
  }
  function needToken(form) {
    if (!cfg.turnstile || ts.token) return true;
    var e = $('[data-turnstile-err]', form); if (e) e.textContent = 'Please complete the security check.';
    return false;
  }
  function resetTurnstile() { if (window.turnstile && ts.id !== null) { window.turnstile.reset(ts.id); ts.token = null; } }

  /* "Other" choices reveal a text field */
  function bindOther(selectId, otherId) {
    var s = document.getElementById(selectId); var f = document.querySelector('[data-field="' + otherId + '"]');
    if (!s || !f) return;
    var sync = function () { f.classList.toggle('is-shown', s.value === 'Other'); if (s.value !== 'Other') setErr(otherId, ''); };
    s.addEventListener('change', sync); sync();
  }

  /* ---------- Create account ---------- */
  var signup = $('[data-shi-form="signup"]');
  if (signup) {
    initTurnstile(signup);
    bindOther('s-role', 's-role-other');
    bindOther('s-heard', 's-heard-other');
    var stateSel = $('#s-state'), cityIn = $('#s-city'), schoolIn = $('#s-school'), schoolId = $('#s-school-id'), unlisted = $('#s-unlisted');
    var cityList = $('#s-city-list'), schoolList = $('#s-school-list');
    var schools = [], cities = [], byValue = {};
    var fillList = function (list, items) {
      var frag = document.createDocumentFragment();
      items.forEach(function (it) { var o = document.createElement('option'); o.value = it.value; if (it.label) o.label = it.label; frag.appendChild(o); });
      list.innerHTML = ''; list.appendChild(frag);
    };
    var syncUnlisted = function () {
      var on = unlisted.checked;
      document.querySelector('[data-field="s-school-other"]').classList.toggle('is-shown', on);
      schoolIn.disabled = on || !cityIn.value; if (on) setErr('s-school', '');
    };
    unlisted.addEventListener('change', syncUnlisted);
    stateSel.addEventListener('change', function () {
      cityIn.value = ''; schoolIn.value = ''; schoolId.value = ''; schools = []; cities = []; fillList(cityList, []); fillList(schoolList, []);
      cityIn.disabled = !stateSel.value; schoolIn.disabled = true;
      if (!stateSel.value) return;
      cityIn.placeholder = 'Loading cities…';
      fetch('/assets/schools/' + stateSel.value + '.json').then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }).then(function (d) {
        schools = d.schools; var seen = {};
        schools.forEach(function (s) { seen[s[2]] = (seen[s[2]] || 0) + 1; });
        cities = Object.keys(seen).sort();
        fillList(cityList, cities.map(function (c) { return { value: c }; }));
        cityIn.placeholder = '';
      }).catch(function () { cityIn.placeholder = ''; });
    });
    var onCity = function () {
      schoolIn.value = ''; schoolId.value = ''; byValue = {};
      var c = cityIn.value.trim().toLowerCase();
      var inCity = schools.filter(function (s) { return s[2].toLowerCase() === c; });
      var names = {}; inCity.forEach(function (s) { names[s[1]] = (names[s[1]] || 0) + 1; });
      var items = inCity.map(function (s) {
        var v = names[s[1]] > 1 ? s[1] + ' (' + s[3] + ')' : s[1];
        byValue[v.toLowerCase()] = s;
        return { value: v, label: [s[3], s[5] ? 'Grades ' + s[5] : '', s[4] ? 'Charter' : ''].filter(Boolean).join(' · ') };
      });
      fillList(schoolList, items);
      schoolIn.disabled = unlisted.checked || !cityIn.value.trim();
    };
    cityIn.addEventListener('change', onCity);
    cityIn.addEventListener('input', function () { if (cities.indexOf(cityIn.value) > -1) onCity(); });
    schoolIn.addEventListener('input', function () { var s = byValue[schoolIn.value.trim().toLowerCase()]; schoolId.value = s ? s[0] : ''; if (s) setErr('s-school', ''); });

    signup.addEventListener('submit', function (e) {
      e.preventDefault(); clearErrs(signup); status(signup);
      if (!ready) return status(signup, 'error', 'School Health Index accounts open soon. Please <a href="/contact/?type=shi">contact us</a> in the meantime.');
      var ok = true, first = null;
      var need = function (id, msg) { if (!val(id)) { ok = setErr(id, msg) && ok; first = first || id; } };
      need('s-first', 'Enter your first name.'); need('s-last', 'Enter your last name.');
      if (!emailOk(val('s-email'))) { ok = setErr('s-email', 'Enter a valid email address.') && ok; first = first || 's-email'; }
      if (val('s-password').length < 10) { ok = setErr('s-password', 'Use at least 10 characters.') && ok; first = first || 's-password'; }
      need('s-role', 'Choose your role.');
      if (val('s-role') === 'Other') need('s-role-other', 'Tell us your role.');
      need('s-time', 'Choose the best time to call.');
      need('s-state', 'Choose your state.'); need('s-city', 'Enter your city.');
      var listed = !unlisted.checked;
      if (listed && !schoolId.value) { ok = setErr('s-school', 'Choose your school from the list, or check "My school isn\'t listed".') && ok; first = first || 's-school'; }
      if (!listed) need('s-school-other', 'Enter your school\'s name.');
      need('s-heard', 'Tell us how you heard about BetterEd.');
      if (val('s-heard') === 'Other') need('s-heard-other', 'Tell us where you heard about BetterEd.');
      need('s-budget', 'Choose a budget range.');
      if (!$('#s-terms').checked) { ok = setErr('s-terms', 'Please agree to the terms to continue.') && ok; first = first || 's-terms'; }
      if (!ok) { document.getElementById(first).focus(); return; }
      if (!needToken(signup)) return;
      busy(signup, true); status(signup, '', 'Creating your account…');
      var meta = {
        shi_signup: true, first_name: val('s-first'), last_name: val('s-last'), phone: val('s-phone'), best_time: val('s-time'),
        role: val('s-role'), role_other: val('s-role-other'), heard_from: val('s-heard'), heard_other: val('s-heard-other'),
        state: val('s-state'), city: val('s-city'), school_nces_id: listed ? schoolId.value : '', school_name: listed ? schoolIn.value.trim() : val('s-school-other'),
        school_listed: listed, budget: val('s-budget'), interest: val('s-interest'), terms_version: cfg.terms,
      };
      sb.auth.signUp({ email: val('s-email'), password: $('#s-password').value, options: { data: meta, captchaToken: ts.token || undefined, emailRedirectTo: window.location.origin + cfg.base + 'exam/' } })
        .then(function (res) {
          resetTurnstile(); busy(signup, false);
          if (res.error) return status(signup, 'error', '<strong>Your account was not created.</strong> ' + friendly(res.error));
          try { sessionStorage.setItem('shi-email', val('s-email')); } catch (x) { /* storage unavailable */ }
          if (res.data && res.data.session) go('exam/'); else go('check-email/');
        });
    });
  }

  /* ---------- Sign in / forgot password ---------- */
  var signin = $('[data-shi-form="signin"]');
  if (signin) {
    initTurnstile(signin);
    if (ready) sb.auth.getSession().then(function (r) { if (r.data && r.data.session) go('exam/'); });
    signin.addEventListener('submit', function (e) {
      e.preventDefault(); clearErrs(signin); status(signin);
      if (!ready) return status(signin, 'error', 'School Health Index accounts open soon.');
      var ok = true;
      if (!emailOk(val('i-email'))) ok = setErr('i-email', 'Enter a valid email address.') && ok;
      if (!$('#i-password').value) ok = setErr('i-password', 'Enter your password.') && ok;
      if (!ok) { $('[aria-invalid="true"]', signin).focus(); return; }
      if (!needToken(signin)) return;
      busy(signin, true);
      sb.auth.signInWithPassword({ email: val('i-email'), password: $('#i-password').value, options: { captchaToken: ts.token || undefined } }).then(function (res) {
        resetTurnstile(); busy(signin, false);
        if (res.error) return status(signin, 'error', friendly(res.error));
        go('exam/');
      });
    });
    $('[data-forgot]', signin).addEventListener('click', function () {
      clearErrs(signin); status(signin);
      if (!ready) return;
      if (!emailOk(val('i-email'))) { setErr('i-email', 'Enter your email, then choose "Forgot your password?" again.'); $('#i-email').focus(); return; }
      if (!needToken(signin)) return;
      sb.auth.resetPasswordForEmail(val('i-email'), { redirectTo: window.location.origin + cfg.base + 'reset/', captchaToken: ts.token || undefined }).then(function (res) {
        resetTurnstile();
        if (res.error) return status(signin, 'error', friendly(res.error));
        status(signin, 'success', '<strong>Check your email.</strong> If an account exists for that address, we sent a link to choose a new password.');
      });
    });
  }

  /* ---------- Check email ---------- */
  var shown = $('[data-email]');
  if (shown) { try { var em = sessionStorage.getItem('shi-email'); if (em) shown.textContent = em; } catch (x) { /* storage unavailable */ } }

  /* ---------- Reset password ---------- */
  var reset = $('[data-shi-form="reset"]');
  if (reset) {
    reset.addEventListener('submit', function (e) {
      e.preventDefault(); clearErrs(reset); status(reset);
      if (!ready) return;
      if ($('#r-password').value.length < 10) { setErr('r-password', 'Use at least 10 characters.'); $('#r-password').focus(); return; }
      busy(reset, true);
      sb.auth.getSession().then(function (r) {
        if (!r.data || !r.data.session) { busy(reset, false); return status(reset, 'error', 'This link has expired. <a href="' + cfg.base + 'sign-in/">Request a new one</a>.'); }
        return sb.auth.updateUser({ password: $('#r-password').value }).then(function (res) {
          busy(reset, false);
          if (res.error) return status(reset, 'error', friendly(res.error));
          go('exam/');
        });
      });
    });
  }

  /* ---------- The index ---------- */
  var exam = $('[data-shi-form="exam"]');
  if (exam) {
    var gate = $('[data-gate]');
    if (!ready) { gate.className = 'form-status is-error'; gate.innerHTML = '<strong>School Health Index accounts open soon.</strong> <a href="/contact/?type=shi">Contact us</a> in the meantime.'; return; }
    var steps = $$('.shi-step', exam), current = 0, sub = null, timer = null, saving = false, dirty = false;
    var saveEl = $('[data-save]');
    var collect = function () {
      var a = {};
      $$('input[type="radio"]:checked', exam).forEach(function (r) { a[r.name] = /^d\d\d_\d$/.test(r.name) ? parseInt(r.value, 10) : r.value; });
      $$('textarea', exam).forEach(function (t) { if (t.value.trim()) a[t.name] = t.value.slice(0, 2000); });
      a._step = current;
      return a;
    };
    var restore = function (a) {
      Object.keys(a || {}).forEach(function (k) {
        var t = exam.querySelector('textarea[name="' + k + '"]'); if (t) { t.value = a[k]; var d = t.closest('details'); if (d) d.open = true; return; }
        $$('input[name="' + k + '"]', exam).forEach(function (r) { if (String(r.value) === String(a[k])) r.checked = true; });
      });
    };
    var questions = function (step) {
      return $$('[data-q]', step).filter(function (q) { return q.classList.contains('likert') || q.querySelector('[data-required]'); })
        .concat($$('textarea[data-required]', step));
    };
    var answered = function (q) { return q.tagName === 'TEXTAREA' ? !!q.value.trim() : !!q.querySelector('input:checked'); };
    var progress = function () {
      var all = steps.reduce(function (n, s) { return n.concat(questions(s)); }, []);
      var done = all.filter(answered).length;
      $('[data-progress-bar]').style.width = (all.length ? Math.round(done / all.length * 100) : 0) + '%';
      var s = steps[current]; var t = s.querySelector('.step-title');
      $('[data-step-label]').textContent = 'Step ' + (current + 1) + ' of ' + steps.length + ': ' + t.textContent.replace(/^\d\d/, '') + ' · ' + Math.round(done / all.length * 100) + '% complete';
    };
    var show = function (i, focus) {
      current = Math.max(0, Math.min(steps.length - 1, i));
      steps.forEach(function (s, k) { s.hidden = k !== current; });
      $('[data-prev]').hidden = current === 0;
      $('[data-next]').hidden = current === steps.length - 1;
      $('[data-submit]').hidden = current !== steps.length - 1;
      $('[data-step-err]').hidden = true;
      progress();
      if (focus) { var t = steps[current].querySelector('.step-title'); t.setAttribute('tabindex', '-1'); t.focus(); window.scrollTo(0, exam.getBoundingClientRect().top + window.scrollY - 140); }
    };
    var check = function (i) {
      var missing = questions(steps[i]).filter(function (q) { var m = !answered(q); (q.closest('[data-q]') || q.closest('.field')).classList.toggle('is-missing', m); return m; });
      if (!missing.length) return true;
      var e = $('[data-step-err]'); e.hidden = false;
      e.textContent = missing.length === 1 ? 'One question still needs an answer.' : missing.length + ' questions still need an answer.';
      var target = missing[0].tagName === 'TEXTAREA' ? missing[0] : missing[0].querySelector('input');
      if (target) target.focus();
      return false;
    };
    var save = function () {
      if (!sub || saving) { dirty = true; return Promise.resolve(); }
      saving = true; dirty = false; saveEl.textContent = 'Saving…';
      return sb.from('shi_submissions').update({ answers: collect() }).eq('id', sub.id).then(function (r) {
        saving = false;
        saveEl.textContent = r.error ? 'Not saved. Check your connection.' : 'Saved';
        if (dirty) save();
      });
    };
    var queue = function () { clearTimeout(timer); saveEl.textContent = 'Unsaved changes'; timer = setTimeout(save, 900); };
    exam.addEventListener('change', function (e) { var q = e.target.closest('[data-q]'); if (q) q.classList.remove('is-missing'); progress(); queue(); });
    exam.addEventListener('input', function (e) { if (e.target.tagName === 'TEXTAREA') { var f = e.target.closest('.field'); if (f) f.classList.remove('is-missing'); progress(); queue(); } });
    $('[data-next]').addEventListener('click', function () { if (check(current)) { show(current + 1, true); save(); } });
    $('[data-prev]').addEventListener('click', function () { show(current - 1, true); save(); });
    $('[data-signout]').addEventListener('click', function () { save().then(function () { return sb.auth.signOut(); }).then(function () { go(''); }); });
    exam.addEventListener('submit', function (e) {
      e.preventDefault();
      for (var i = 0; i < steps.length; i++) if (!check(i)) { show(i, true); check(i); return; }
      var btn = $('[data-submit]'); btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); clearTimeout(timer);
      sb.from('shi_submissions').update({ answers: collect(), status: 'submitted' }).eq('id', sub.id).then(function (r) {
        if (r.error) { btn.disabled = false; btn.removeAttribute('aria-disabled'); var el = $('[data-step-err]'); el.hidden = false; el.textContent = 'Your School Health Index was not submitted. Please try again in a moment.'; return; }
        go('submitted/');
      });
    });
    window.addEventListener('beforeunload', function (e) { if (saveEl.textContent === 'Unsaved changes') { save(); e.preventDefault(); } });

    sb.auth.getSession().then(function (r) {
      var session = r.data && r.data.session;
      if (!session) { go('sign-in/'); return null; }
      var uid = session.user.id;
      return Promise.all([
        sb.from('profiles').select('first_name, school_name').eq('id', uid).maybeSingle(),
        sb.from('shi_submissions').select('id, status, answers').eq('user_id', uid).maybeSingle(),
      ]).then(function (res) {
        var p = res[0].data, s = res[1].data;
        if (p) { $('[data-greet]').textContent = 'Welcome, ' + p.first_name; $('[data-school]').textContent = p.school_name; }
        if (s && s.status !== 'draft') { go('submitted/'); return null; }
        if (s) return s;
        return sb.from('shi_submissions').insert({ user_id: uid, answers: {} }).select('id, status, answers').single().then(function (ins) { return ins.data; });
      });
    }).then(function (s) {
      if (!s) { if (gate.textContent.indexOf('Loading') > -1) { gate.className = 'form-status is-error'; gate.innerHTML = 'We could not load your School Health Index. Please refresh, or <a href="' + cfg.base + 'sign-in/">sign in again</a>.'; } return; }
      sub = s; restore(s.answers);
      gate.hidden = true; exam.hidden = false;
      show(typeof s.answers._step === 'number' ? s.answers._step : 0, false);
      saveEl.textContent = 'Saved';
    });
  }
})();
