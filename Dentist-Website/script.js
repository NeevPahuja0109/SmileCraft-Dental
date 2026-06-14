/* ============================================
   SmileCraft Dental – JavaScript v2
   ============================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initNav();
  initActiveNavLinks();
  initSmoothScroll();
  initHeroAnimation();
  initScrollReveal();
  initCounters();
  initComparisonSliders();
  initFAQ();
  initAppointmentForm();
  initRipple();
  initBackToTop();
  initFooterYear();
});

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  const update = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? (scrolled / total * 100) + '%' : '0%';
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── Sticky Navigation ── */
function initNav() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu?.addEventListener('click', e => {
    if (e.target.classList.contains('nav__link')) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('click', e => {
    if (!header.contains(e.target) && menu.classList.contains('open')) {
      menu.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Active Nav Link ── */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link:not(.nav__cta)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        links.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -65% 0px' });
  sections.forEach(s => observer.observe(s));
}

/* ── Smooth Scroll ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header')?.offsetHeight || 76;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });
}

/* ── Hero Entrance Animation (staggered) ── */
function initHeroAnimation() {
  const els = document.querySelectorAll('.hero-anim');
  els.forEach(el => {
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => el.classList.add('visible'), 300 + delay);
  });
}

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ── Animated Counters ── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  let started = false;
  const run = () => {
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const dur = 2200;
      const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  };
  const bar = document.querySelector('.trust-bar');
  if (!bar) return;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      run();
      observer.disconnect();
    }
  }, { threshold: 0.25 });
  observer.observe(bar);
}

/* ── Before/After Comparison Sliders ── */
function initComparisonSliders() {
  /* Tab switching */
  const tabs   = document.querySelectorAll('.comp-tab');
  const slides = document.querySelectorAll('.comp-slide');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = parseInt(tab.dataset.index, 10);
      tabs.forEach(t  => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      slides.forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const slide = slides[idx];
      if (slide) slide.classList.add('active');
    });
  });

  /* Drag functionality for every slider */
  document.querySelectorAll('.comparison-slider').forEach(slider => {
    const after   = slider.querySelector('.comp-after');
    const divider = slider.querySelector('.comp-divider');
    if (!after || !divider) return;

    let dragging = false;

    const setPos = clientX => {
      const rect = slider.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.min(Math.max(pct, 2), 98);
      /* clip left pct% of .comp-after → AFTER visible on right, BEFORE shows on left */
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      divider.style.left = pct + '%';
    };

    /* Mouse */
    divider.addEventListener('mousedown', e => { dragging = true; e.preventDefault(); });
    slider.addEventListener('mousedown',  e => { dragging = true; setPos(e.clientX); });
    window.addEventListener('mousemove',  e => { if (dragging) setPos(e.clientX); });
    window.addEventListener('mouseup',    ()  => { dragging = false; });

    /* Touch */
    divider.addEventListener('touchstart', e => { dragging = true; e.preventDefault(); }, { passive: false });
    window.addEventListener('touchmove',   e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchend',    ()  => { dragging = false; });

    /* Auto-animate when first seen: sweep from full-before → 50% */
    let animated = false;
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !animated) {
        animated = true;
        autoSweep(after, divider);
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(slider);
  });
}

function autoSweep(after, divider) {
  /* Start: divider at 85% (mostly before visible), animate to 50% to reveal AFTER */
  let start = null;
  const duration = 1600;
  const from = 85, to = 50;

  after.style.clipPath = `inset(0 0 0 ${from}%)`;
  divider.style.left   = from + '%';

  setTimeout(() => {
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3); /* ease-out cubic */
      const v = from + (to - from) * e;
      after.style.clipPath = `inset(0 0 0 ${v}%)`;
      divider.style.left   = v + '%';
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, 500);
}

/* ── FAQ Accordion ── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-item__question');
    const a = item.querySelector('.faq-item__answer');
    q?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      /* close all */
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const ans = i.querySelector('.faq-item__answer');
        if (ans) ans.style.maxHeight = '0';
        i.querySelector('.faq-item__question')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── Appointment Form ── */
function initAppointmentForm() {
  const form    = document.getElementById('appointmentForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  /* Set minimum date to tomorrow */
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    dateInput.min = tom.toISOString().split('T')[0];
  }

  const rules = {
    fname:   { required: true, minLen: 2,   label: 'First name' },
    lname:   { required: true, minLen: 2,   label: 'Last name' },
    email:   { required: true, email: true, label: 'Email address' },
    phone:   { required: true, phone: true, label: 'Phone number' },
    service: { required: true,              label: 'Service' },
    date:    { required: true,              label: 'Preferred date' },
  };

  const validate = (name, value) => {
    const r = rules[name];
    if (!r) return '';
    if (r.required && !value.trim()) return `${r.label} is required.`;
    if (r.minLen && value.trim().length < r.minLen) return `${r.label} must be at least ${r.minLen} characters.`;
    if (r.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'Please enter a valid email address.';
    if (r.phone && !/^[\d\s()+\-]{7,15}$/.test(value.trim())) return 'Please enter a valid phone number.';
    return '';
  };

  const showErr = (name, msg) => {
    const f = form.elements[name];
    const e = document.getElementById(`${name}Error`);
    if (f) f.classList.toggle('error', !!msg);
    if (e) e.textContent = msg;
  };

  Object.keys(rules).forEach(name => {
    const f = form.elements[name];
    if (!f) return;
    f.addEventListener('blur',  () => showErr(name, validate(name, f.value)));
    f.addEventListener('input', () => { if (f.classList.contains('error')) showErr(name, validate(name, f.value)); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    Object.keys(rules).forEach(name => {
      const f = form.elements[name];
      const msg = validate(name, f?.value || '');
      showErr(name, msg);
      if (msg) valid = false;
    });
    if (!valid) { form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }

    const btn      = form.querySelector('button[type="submit"]');
    const btnText  = btn?.querySelector('.btn-text');
    const btnLoad  = btn?.querySelector('.btn-loading');
    if (btn)     btn.disabled = true;
    if (btnText) btnText.style.display = 'none';
    if (btnLoad) btnLoad.style.display = 'inline';

    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'flex';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1400);
  });
}

/* ── Ripple Effect on Buttons ── */
function initRipple() {
  document.querySelectorAll('.ripple-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const span = document.createElement('span');
      span.className = 'btn-ripple';
      span.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;`;
      this.appendChild(span);
      setTimeout(() => span.remove(), 700);
    });
  });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Footer Year ── */
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}
