// Category filter
function filterCat(btn, cat) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    if (cat === 'All' || card.dataset.cat === cat) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Add to cart feedback
function addToCart(btn) {
  const orig = btn.textContent;
  btn.textContent = '✓';
  btn.style.background = '#22C55E';
  btn.style.color = 'white';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.color = '';
  }, 900);
}

// Simple carousel logic (slide cards left/right)
let offset = 0;
document.querySelector('.carousel-btns').addEventListener('click', e => {
  const btn = e.target.closest('.carousel-btn');
  if (!btn) return;
  const row = document.querySelector('.pharmacies-row');
  const dir = btn.textContent.includes('←') ? 1 : -1;
  offset = Math.max(0, Math.min(offset + dir, 0));
});

function setupMobileNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  const backdrop = ensureBackdrop();
  const drawer = ensureNavDrawer();
  const hamburgerBtn = ensureHamburgerButton(nav);

  hamburgerBtn.addEventListener('click', () => openNavDrawer(drawer, hamburgerBtn));

  drawer.querySelector('[data-action="close-nav"]')?.addEventListener('click', () =>
    closeNavDrawer(drawer, hamburgerBtn),
  );

  drawer.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', () => closeNavDrawer(drawer, hamburgerBtn));
  });

  backdrop.addEventListener('click', () => closeNavDrawer(drawer, hamburgerBtn));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNavDrawer(drawer, hamburgerBtn);
  });
}

function ensureBackdrop() {
  let backdrop = document.getElementById('appBackdrop');
  if (backdrop) return backdrop;
  backdrop = document.createElement('div');
  backdrop.id = 'appBackdrop';
  backdrop.className = 'app-backdrop';
  document.body.appendChild(backdrop);
  return backdrop;
}

function setModalOpen(isOpen) {
  document.body.classList.toggle('is-modal-open', isOpen);
  document.getElementById('appBackdrop')?.classList.toggle('is-active', isOpen);
}

function ensureNavDrawer() {
  let drawer = document.getElementById('navDrawer');
  if (drawer) return drawer;

  drawer = document.createElement('aside');
  drawer.id = 'navDrawer';
  drawer.className = 'app-drawer';
  drawer.setAttribute('aria-hidden', 'true');

  const header = document.createElement('div');
  header.className = 'drawer-header';
  header.innerHTML = `
    <div class="drawer-title">Menu</div>
    <button class="drawer-close" type="button" aria-label="Close menu" data-action="close-nav">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    </button>
  `;

  const linksWrap = document.createElement('nav');
  linksWrap.className = 'drawer-links';
  const linksFromDom = [...document.querySelectorAll('.nav-links a')];
  const activeHref =
    document.querySelector('.nav-links a.active')?.getAttribute('href') ||
    (window.location.pathname || '').split('/').pop() ||
    '';

  const menuDefaults = [
    { href: 'home.html', label: 'Home' },
    { href: 'jevacare-doctors.html', label: 'Doctors' },
    { href: 'jevacare-pharmacy.html', label: 'Pharmacies' },
    { href: 'appointment.html', label: 'Book' },
    { href: 'chat.html', label: 'Chat' },
  ];

  const menuItems = linksFromDom
    .map(a => ({
      href: a.getAttribute('href') || '',
      label: (a.textContent || '').trim(),
    }))
    .filter(item => item.href && item.label);

  const existingHrefs = new Set(menuItems.map(i => i.href));
  menuDefaults.forEach(item => {
    if (!existingHrefs.has(item.href)) menuItems.push(item);
  });

  menuItems.forEach(item => {
    const a = document.createElement('a');
    a.href = item.href;
    a.textContent = item.label;
    if (item.href === activeHref || (activeHref && item.href.endsWith(activeHref))) a.classList.add('active');
    linksWrap.appendChild(a);
  });

  drawer.appendChild(header);
  drawer.appendChild(linksWrap);
  document.body.appendChild(drawer);
  return drawer;
}

function ensureHamburgerButton(nav) {
  let btn = document.getElementById('navHamburger');
  if (btn) return btn;

  btn = document.createElement('button');
  btn.id = 'navHamburger';
  btn.className = 'nav-hamburger';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Open menu');
  btn.setAttribute('aria-controls', 'navDrawer');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `;

  const logo = nav.querySelector('.nav-logo');
  if (logo) nav.insertBefore(btn, logo);
  else nav.prepend(btn);
  return btn;
}

function openNavDrawer(drawer, hamburgerBtn) {
  if (!drawer) return;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  hamburgerBtn?.setAttribute('aria-expanded', 'true');
  setModalOpen(true);
}

function closeNavDrawer(drawer, hamburgerBtn) {
  if (!drawer) return;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  hamburgerBtn?.setAttribute('aria-expanded', 'false');
  setModalOpen(false);
}

setupMobileNav();
