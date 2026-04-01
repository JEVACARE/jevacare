// ══════════════════════════════════════════
//  JEVACARE – Doctor Profile JS
// ══════════════════════════════════════════

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── BELL ──
document.getElementById('bellBtn').addEventListener('click', () => {
  showToast('No new notifications');
});

// ── DATE SELECTION ──
function selectDate(btn, label) {
  document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast('Selected: ' + label);
}

// ── BOOK APPOINTMENT ──
function bookAppointment() {
  const btn = document.getElementById('bookBtn');
  btn.textContent = 'Booking...';
  btn.style.background = '#16A34A';
  setTimeout(() => {
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="white" stroke-width="2.2">
        <path d="M3 10l5 5 9-9"/>
      </svg>
      Appointment Confirmed!
    `;
    showToast('✓ Appointment booked with Dr. Arisov');
    setTimeout(() => {
      btn.innerHTML = `Book Appointment
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 10h12M11 5l5 5-5 5"/>
        </svg>`;
      btn.style.background = '';
    }, 3000);
  }, 1200);
}

// ── ACCORDION ──
function toggleAccordion(id) {
  const item   = document.getElementById(id);
  const btn    = item.querySelector('.accordion-btn');
  const body   = item.querySelector('.accordion-body');
  const isOpen = body.classList.contains('open');

  // Close all
  document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.accordion-btn').forEach(b => b.classList.remove('open'));

  // Open clicked if it was closed
  if (!isOpen) {
    body.classList.add('open');
    btn.classList.add('open');
  }
}

// ── LIKE BUTTON ──
function toggleLike(btn) {
  btn.classList.toggle('liked');
  const icon = btn.querySelector('svg');
  if (btn.classList.contains('liked')) {
    icon.setAttribute('fill', '#2563EB');
    icon.setAttribute('stroke', '#2563EB');
    showToast('Thanks for your feedback!');
  } else {
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
  }
}

// ── STAT CARD HOVER TOOLTIPS ──
document.querySelectorAll('.stat-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.cursor = 'default';
  });
});

// ── SMOOTH SCROLL for any hash links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── CERTIFICATION CARD CLICK ──
document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const name = card.querySelector('.cert-name').textContent;
    showToast('Certificate: ' + name);
  });
  card.style.cursor = 'pointer';
});