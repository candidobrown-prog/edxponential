/* BetterEd — Vital Motion + interface behaviours. No dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');

  /* Analytics hook: privacy-light. Forwards to Plausible only if the owner installs it. */
  function track(name, props) {
    try {
      if (typeof window.plausible === 'function') window.plausible(name, { props: props || {} });
      if (window.__betteredEvents) window.__betteredEvents.push({ name: name, props: props || {} });
    } catch (e) { /* never break the page for analytics */ }
  }
  window.betteredTrack = track;
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-track]');
    if (t) track(t.getAttribute('data-track'), { label: t.getAttribute('data-track-label') || t.textContent.trim().slice(0, 60), path: location.pathname });
  });
  var pageEvent = document.body.getAttribute('data-page-event');
  if (pageEvent) track(pageEvent, { path: location.pathname });

  /* Mobile menu (disclosure + focus containment) */
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var lastFocus;
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.label').textContent = open ? 'Close' : 'Menu';
      menu.classList.toggle('is-open', open);
      menu.toggleAttribute('inert', !open);
      document.body.classList.toggle('menu-open', open);
      if (open) { lastFocus = document.activeElement; var f = menu.querySelector('a'); if (f) f.focus(); }
      else if (lastFocus) { toggle.focus(); }
    };
    menu.setAttribute('inert', '');
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false);
      if (e.key === 'Tab' && menu.classList.contains('is-open')) {
        var items = [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll('a, button')));
        var first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 64rem)').addEventListener('change', function (m) { if (m.matches) setOpen(false); });
  }

  /* Scroll progress: the navy rule grows, the signal rides its leading edge */
  var progress = document.querySelector('.progress');
  if (progress) {
    var ticking = false;
    var update = function () {
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.setProperty('--p', p.toFixed(4));
      progress.style.setProperty('--po', p > 0.01 ? 1 : 0);
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }

  /* Diagnostic Cross artwork: blocks assemble once */
  var lines = document.querySelectorAll('.cross-art[data-draw]');
  function draw(svg) { requestAnimationFrame(function () { svg.classList.add('is-drawn'); }); }

  /* Reveal once */
  var revealables = document.querySelectorAll('[data-reveal], [data-draw]:not([data-draw="load"]), [data-count], [data-mastery]');
  if (reduce || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in', 'is-drawn'); });
    lines.forEach(function (el) { el.classList.add('is-drawn'); });
  } else {
    document.querySelectorAll('[data-draw="load"]').forEach(function (svg) { setTimeout(function () { draw(svg); }, 120); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        if (el.matches('.cross-art[data-draw]')) draw(el);
        else if (el.hasAttribute('data-count')) countUp(el);
        else el.classList.add('is-in');
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* Metrics count once. The final value is already in the HTML. */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var out = el.querySelector('.n');
    if (!out || isNaN(target)) return;
    var start = performance.now(), dur = 900;
    var step = function (now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      out.textContent = prefix + Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step); else out.textContent = prefix + target;
    };
    out.textContent = prefix + '0';
    requestAnimationFrame(step);
    el.classList.add('is-in');
  }

  /* Method spine: the cross fills in as each stage is reached */
  var spine = document.querySelector('.method-spine');
  var steps = document.querySelectorAll('.step[data-stage]');
  if (steps.length) {
    var nodes = spine ? spine.querySelectorAll('.node') : [];
    var labels = spine ? spine.querySelectorAll('.labels span') : [];
    var setStage = function (i) {
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      nodes.forEach(function (n) { n.classList.toggle('is-on', parseInt(n.getAttribute('data-stage'), 10) <= i); });
      labels.forEach(function (l, k) { l.classList.toggle('is-active', k === i); });
    };
    if ('IntersectionObserver' in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setStage(parseInt(en.target.getAttribute('data-stage'), 10)); });
      }, { rootMargin: '-45% 0px -45% 0px' });
      steps.forEach(function (s) { so.observe(s); });
    }
    setStage(0);
  }

  /* School Health Index domain explorer (ARIA tabs, arrow keys) */
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) {
          panel.hidden = !on;
          if (on && !reduce) { panel.classList.remove('is-entering'); void panel.offsetWidth; panel.classList.add('is-entering'); }
        }
      });
      if (focus) tab.focus();
      track('SHI domain viewed', { domain: tab.getAttribute('data-domain') });
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var k = e.key, n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === 'Home') n = tabs[0];
        if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  /* Contact form: validation, pending, honest success / failure */
  var form = document.querySelector('form[data-contact]');
  if (form) {
    var params = new URLSearchParams(location.search);
    var type = params.get('type');
    var sel = form.querySelector('#f-type');
    if (type && sel) {
      var map = { diagnostic: 'Start with the diagnosis', shi: 'School Health Index', culture: 'School Health', leadership: 'Leader Development', educator: 'Teacher Development', turnaround: 'Intensive Care', partnership: 'Partnership', procurement: 'Procurement', other: 'Other' };
      if (map[type]) sel.value = map[type];
    }
    var startedField = form.querySelector('[name="started_at"]');
    if (startedField) startedField.value = String(Date.now());
    var status = document.getElementById('form-status');
    var submit = form.querySelector('[type="submit"]');
    var started = false;
    form.addEventListener('input', function () { if (!started) { started = true; track('Contact started', { type: sel ? sel.value : '' }); } }, { once: false });
    var setErr = function (field, msg) {
      var wrap = field.closest('.field');
      var err = wrap && wrap.querySelector('.error');
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (wrap) wrap.classList.toggle('has-error', !!msg);
      if (err) err.textContent = msg || '';
    };
    var validate = function () {
      var firstBad = null;
      form.querySelectorAll('[data-validate]').forEach(function (f) {
        var v = f.value.trim(), msg = '';
        if (f.required && !v) msg = f.getAttribute('data-required-msg') || 'This field is required.';
        else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter an email address like name@district.org.';
        else if (f.maxLength > 0 && v.length > f.maxLength) msg = 'Please shorten this to ' + f.maxLength + ' characters.';
        setErr(f, msg);
        if (msg && !firstBad) firstBad = f;
      });
      return firstBad;
    };
    form.querySelectorAll('[data-validate]').forEach(function (f) {
      f.addEventListener('blur', function () { if (f.getAttribute('aria-invalid') === 'true' || f.value) validate(); });
    });
    var show = function (kind, title, body) {
      status.hidden = false;
      status.className = 'form-status is-' + kind;
      status.innerHTML = '<strong></strong><p></p>';
      status.querySelector('strong').textContent = title;
      status.querySelector('p').textContent = body;
      status.focus();
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (submit.getAttribute('aria-disabled') === 'true') return; // duplicate-submit guard
      var bad = validate();
      if (bad) {
        show('error', 'Please check the highlighted fields.', 'Nothing has been sent yet.');
        bad.focus();
        return;
      }
      var endpoint = form.getAttribute('action');
      submit.setAttribute('aria-disabled', 'true');
      var label = submit.querySelector('.label');
      var original = label.textContent;
      label.textContent = 'Sending…';
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok === true, j: j }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            show('success', 'Thank you. Your message reached BetterEd.', 'A BetterEd partner reads every message and will reply to schedule a 30-minute conversation.');
            track('Contact completed', { type: data.inquiry_type || '' });
            if (data.inquiry_type === 'Procurement') track('Procurement inquiry', {});
          } else {
            throw new Error((res.j && res.j.error) || 'delivery');
          }
        })
        .catch(function () {
          show('error', 'Your message was not sent.', 'Something went wrong on our side. Your text is still in the form. Please try again, or email info@betteredsolutions.org directly.');
          track('Contact failed', {});
        })
        .then(function () { submit.removeAttribute('aria-disabled'); label.textContent = original; });
    });
  }
})();
