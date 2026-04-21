/* ============================================================
   The Next Chapter Concierge — Main JS
   ============================================================ */

(function () {
  'use strict';

  /* ---- Utility ---- */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---- Mobile Navigation ---- */
  const hamburger  = qs('.hamburger');
  const mobileNav  = qs('.mobile-nav');
  const mobileLinks = qsa('.mobile-nav a');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---- Scrolled header state ---- */
  const header = qs('.site-header');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Active nav link highlight ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  qsa('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---- Smooth scroll for anchor links ---- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = qs(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  /* ---- Lead magnet / guide form ---- */
  function handleLeadForm(formId, successId) {
    const form    = qs(`#${formId}`);
    const success = qs(`#${successId}`);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn ? btn.textContent : '';
      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
      }

      const name  = (form.querySelector('[name="name"]')  || {}).value || '';
      const email = (form.querySelector('[name="email"]') || {}).value || '';

      try {
        const res = await fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email }),
        });

        if (!res.ok) throw new Error('Server error');

        form.style.display = 'none';
        if (success) success.style.display = 'block';
      } catch {
        if (btn) {
          btn.textContent = originalText;
          btn.disabled = false;
        }
        alert('Something went wrong. Please try again or email us directly.');
      }
    });
  }

  handleLeadForm('lead-magnet-form', 'lead-magnet-success');
  handleLeadForm('guide-hero-form',   'guide-hero-success');
  handleLeadForm('guide-bottom-form', 'guide-bottom-success');

  /* ---- Contact form ---- */
  const contactForm    = qs('#contact-form');
  const contactSuccess = qs('#contact-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending…';
        btn.disabled = true;
      }
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (contactSuccess) {
          contactSuccess.style.display = 'block';
        }
      }, 900);
    });
  }

  /* ---- Intersection Observer: fade-in on scroll ---- */
  const fadeEls = qsa('[data-fade]');

  if (fadeEls.length && 'IntersectionObserver' in window) {
    const style = document.createElement('style');
    style.textContent = `
      [data-fade] {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.6s ease, transform 0.6s ease;
      }
      [data-fade].visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      io.observe(el);
    });
  }

})();
