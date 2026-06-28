document.getElementById('footer-year').textContent = new Date().getFullYear();

// Hamburger menu
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

function closeMenu() {
  navMenu.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close on link click
navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) closeMenu();
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => observer.observe(section));

// Contact form — validation + Formspree submission
const form = document.getElementById('contact-form');
if (form) {
  const statusEl = form.querySelector('.form-status');
  const submitBtn = form.querySelector('#submit-btn');

  function validateField(input) {
    const errorEl = input.closest('.form-group').querySelector('.field-error');
    let message = '';
    if (!input.value.trim()) {
      message = 'This field is required.';
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      message = 'Please enter a valid email address.';
    }
    errorEl.textContent = message;
    input.classList.toggle('invalid', !!message);
    return !message;
  }

  form.querySelectorAll('input:not([name="_gotcha"]), textarea').forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fields = [...form.querySelectorAll('input:not([name="_gotcha"]), textarea')];
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        statusEl.textContent = 'Message sent! I\'ll be in touch soon.';
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('Server error');
      }
    } catch {
      statusEl.textContent = 'Something went wrong. Please try emailing directly.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}

// Hide scroll indicator on scroll
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
  window.addEventListener('scroll', () => {
    scrollIndicator.classList.toggle('hidden', window.scrollY > 60);
  }, { passive: true });
}

// Smooth-scroll polyfill for older Safari
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
