// index1.js - JevaCare My Health Page

document.addEventListener('DOMContentLoaded', () => {
  // ── Mobile drawer ────────────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  let lastFocusEl = null;

  const setDrawerOpen = (isOpen) => {
    if (!drawer || !overlay) return;

    drawer.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    if (hamburger) hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      lastFocusEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      (drawerClose || drawer.querySelector('a, button'))?.focus?.();
    } else {
      lastFocusEl?.focus?.();
      lastFocusEl = null;
    }
  };

  hamburger?.addEventListener('click', () => setDrawerOpen(true));
  drawerClose?.addEventListener('click', () => setDrawerOpen(false));
  overlay?.addEventListener('click', () => setDrawerOpen(false));

  drawer?.addEventListener('click', (e) => {
    const clickedLink = e.target instanceof Element ? e.target.closest('a') : null;
    if (clickedLink) setDrawerOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (drawer?.classList.contains('open')) setDrawerOpen(false);
  });

  // ── Sticky nav shadow ───────────────────────────────────────────────────────
  const navbar = document.querySelector('.navigation');
  if (navbar) {
    window.addEventListener(
      'scroll',
      () => {
        navbar.style.boxShadow = window.scrollY > 8 ? '0 2px 14px rgba(0,0,0,0.09)' : '';
      },
      { passive: true }
    );
  }

  // ── Sidebar active link switching ──────────────────────────────────────────
  const sideItems = Array.from(document.querySelectorAll('.side-item'));
  sideItems.forEach((item) => {
    item.addEventListener('click', () => {
      sideItems.forEach((s) => s.classList.remove('active-item'));
      item.classList.add('active-item');
    });
  });

  // ── Appointment card buttons ───────────────────────────────────────────────
  document.querySelectorAll('.btn-view').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.appt-card');
      const doctorName = card?.querySelector('.card-doctor')?.textContent?.trim() || 'the clinic';
      alert(`Opening clinic details for ${doctorName}`);
    });
  });

  document.querySelectorAll('.btn-reschedule').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.appt-card');
      const doctorName = card?.querySelector('.card-doctor')?.textContent?.trim() || 'this doctor';
      const confirmed = confirm(`Reschedule appointment with ${doctorName}?`);
      if (!confirmed) return;

      btn.textContent = 'Requested';
      btn.disabled = true;
    });
  });

  // ── Prescription view history ──────────────────────────────────────────────
  const viewHistoryBtn = document.querySelector('.view-history-btn');
  if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener('click', () => {
      const originalText = viewHistoryBtn.textContent;
      viewHistoryBtn.textContent = 'Loading history...';
      setTimeout(() => {
        viewHistoryBtn.textContent = originalText || 'View Full Prescription History';
        alert('Prescription history would open here.');
      }, 800);
    });
  }

  // ── Save profile form ──────────────────────────────────────────────────────
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const saveToast = document.getElementById('saveToast');
  const profileForm = document.getElementById('profileForm');

  const originalValues = {};
  if (profileForm) {
    profileForm.querySelectorAll('.form-input').forEach((input) => {
      originalValues[input.id] = input.value;
    });
  }

  saveBtn?.addEventListener('click', () => {
    const fullName = document.getElementById('fullName');
    const emailAddr = document.getElementById('emailAddr');

    if (fullName && fullName.value.trim() === '') {
      fullName.style.borderColor = '#ef4444';
      fullName.focus();
      return;
    }
    if (emailAddr && emailAddr.value.trim() === '') {
      emailAddr.style.borderColor = '#ef4444';
      emailAddr.focus();
      return;
    }

    profileForm?.querySelectorAll('.form-input').forEach((input) => {
      input.style.borderColor = '';
      originalValues[input.id] = input.value;
    });

    if (saveToast) {
      saveToast.style.display = 'block';
      setTimeout(() => {
        saveToast.style.display = 'none';
      }, 3000);
    }
  });

  cancelBtn?.addEventListener('click', () => {
    profileForm?.querySelectorAll('.form-input').forEach((input) => {
      input.value = originalValues[input.id] || '';
      input.style.borderColor = '';
    });
  });

  profileForm?.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('input', () => {
      input.style.borderColor = '';
    });
  });

  // ── Notification toggle feedback ───────────────────────────────────────────
  document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach((toggle) => {
    toggle.addEventListener('change', () => {
      const label = toggle.closest('.notif-item')?.querySelector('h4')?.textContent?.trim() || 'Notifications';
      const state = toggle.checked ? 'enabled' : 'disabled';
      console.log(`${label} notifications ${state}`);
    });
  });

  // ── Security manage button ────────────────────────────────────────────────
  document.getElementById('securityBtn')?.addEventListener('click', () => {
    alert('Security settings panel would open here.');
  });

  // ── Payment dots menu ──────────────────────────────────────────────────────
  const visaDotsBtn = document.getElementById('visaDotsBtn');
  const visaMenu = document.getElementById('visaMenu');

  if (visaDotsBtn && visaMenu) {
    visaDotsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      visaMenu.classList.toggle('open');
    });

    document.addEventListener('click', () => {
      visaMenu.classList.remove('open');
    });

    visaMenu.querySelector('.remove-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      const confirmed = confirm('Remove this payment method?');
      if (confirmed) {
        const paymentItem = visaDotsBtn.closest('.payment-item');
        if (paymentItem) {
          paymentItem.style.opacity = '0';
          paymentItem.style.transition = 'opacity 0.3s ease';
          setTimeout(() => paymentItem.remove(), 300);
        }
      }
      visaMenu.classList.remove('open');
    });
  }
});

