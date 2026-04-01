// ── TOGGLE FILTER SECTIONS ──
function toggleSection(id) {
  const section = document.getElementById(id);
  const chevron = document.getElementById('chevron-' + id);
  if (!section) return;
  section.classList.toggle('collapsed');
  if (chevron) chevron.classList.toggle('open');
}

// ── FILTER DOCTORS ──
function filterDoctors() {
  const cards = document.querySelectorAll('.doctor-card');
  const nameVal = (document.getElementById('nameFilter')?.value || '').trim().toLowerCase();
  const locationVal = (document.getElementById('locationFilter')?.value || '').trim().toLowerCase();

  const checkedSpecialties = [...document.querySelectorAll('#specialty input[type="checkbox"]')]
    .filter(cb => cb.checked && cb.value)
    .map(cb => cb.value);

  const checkedRatings = [...document.querySelectorAll('#rating input[type="checkbox"]')]
    .filter(cb => cb.checked)
    .map(cb => parseFloat(cb.value))
    .filter(n => !Number.isNaN(n));
  const minRating = checkedRatings.length ? Math.max(...checkedRatings) : null;

  const checkedAvailability = [...document.querySelectorAll('#availability input[type="checkbox"]')]
    .filter(cb => cb.checked && cb.value)
    .map(cb => cb.value);

  let visibleCount = 0;

  cards.forEach(card => {
    const specialty = card.dataset.specialty || '';
    const rating = parseFloat(card.dataset.rating || '0');
    const available = card.dataset.available || '';
    const nameEl = card.querySelector('.doctor-name');
    const name = nameEl ? nameEl.textContent.toLowerCase() : '';
    const locationText = (card.querySelector('.doctor-meta span')?.textContent || '').toLowerCase();

    const nameMatch = !nameVal || name.includes(nameVal);
    const locationMatch = !locationVal || locationText.includes(locationVal);
    const specialtyMatch = checkedSpecialties.length === 0 || checkedSpecialties.includes(specialty);
    const ratingMatch = minRating === null || rating >= minRating;
    const availabilityMatch = checkedAvailability.length === 0 || checkedAvailability.includes(available);

    if (nameMatch && locationMatch && specialtyMatch && ratingMatch && availabilityMatch) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  // Update count
  document.getElementById('resultsCount').textContent =
    visibleCount + ' Doctor' + (visibleCount !== 1 ? 's' : '') + ' available in your area';

  // Show/hide no results
  document.getElementById('noResults').style.display = visibleCount === 0 ? 'block' : 'none';
}

// Live name/location search
document.getElementById('nameFilter')?.addEventListener('input', filterDoctors);

// ── QUICK FILTER PILLS ──
function quickFilter(btn, type) {
  document.querySelectorAll('.quick-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  const cards = document.querySelectorAll('.doctor-card');
  let visibleCount = 0;

  cards.forEach(card => {
    let show = true;

    if (type === 'available') {
      show = card.dataset.available === 'today';
    } else if (type === 'top') {
      show = parseFloat(card.dataset.rating) >= 4.8;
    } else if (type !== 'All') {
      show = card.dataset.specialty === type;
    }

    card.style.display = show ? '' : 'none';
    if (show) visibleCount++;
  });

  document.getElementById('resultsCount').textContent =
    visibleCount + ' Doctor' + (visibleCount !== 1 ? 's' : '') + ' available in your area';

  document.getElementById('noResults').style.display = visibleCount === 0 ? 'block' : 'none';
}

// ── SORT DOCTORS ──
function sortDoctors(value) {
  const grid = document.getElementById('doctorsGrid');
  const cards = [...grid.querySelectorAll('.doctor-card')];

  cards.sort((a, b) => {
    if (value === 'rating') {
      return parseFloat(b.dataset.rating) - parseFloat(a.dataset.rating);
    } else if (value === 'experience') {
      const getExp = card => parseInt(card.querySelector('.doctor-exp').textContent);
      return getExp(b) - getExp(a);
    }
    return 0;
  });

  cards.forEach(card => grid.appendChild(card));
}

// ── PAGINATION ──
let currentPage = 1;

function goToPage(page) {
  currentPage = page;
  document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
  const targetBtn = document.getElementById('page' + page);
  if (targetBtn) targetBtn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changePage(dir) {
  const newPage = currentPage + dir;
  if (newPage >= 1 && newPage <= 12) goToPage(newPage);
}

// ── BOOK APPOINTMENT FEEDBACK ──
document.querySelectorAll('.btn-book').forEach(btn => {
  btn.addEventListener('click', function () {
    const original = this.textContent;
    this.textContent = 'Booked ✓';
    this.style.background = '#22C55E';
    setTimeout(() => {
      this.textContent = original;
      this.style.background = '';
    }, 1500);
  });
});

function setupFilters() {
  const locationInput = document.querySelector('input[placeholder="City or Zip..."]');
  if (locationInput && !locationInput.id) locationInput.id = 'locationFilter';
  locationInput?.addEventListener('input', filterDoctors);

  const ratingCbs = [...document.querySelectorAll('#rating input[type="checkbox"]')];
  ['4.5', '4', '3'].forEach((val, i) => {
    if (ratingCbs[i]) ratingCbs[i].value = val;
  });

  const availabilityCbs = [...document.querySelectorAll('#availability input[type="checkbox"]')];
  ['today', 'tomorrow', 'weekend'].forEach((val, i) => {
    if (availabilityCbs[i]) availabilityCbs[i].value = val;
  });
}

function setupMobileUI() {
  const navInner = document.querySelector('.nav-inner');
  if (!navInner) return;

  const backdrop = ensureBackdrop();
  backdrop.addEventListener('click', closeAllOverlays);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllOverlays();
  });

  const navDrawer = ensureNavDrawer();
  const hamburgerBtn = ensureHamburgerButton();

  hamburgerBtn.addEventListener('click', () => openNavDrawer(navDrawer, hamburgerBtn));

  const sidebar = document.querySelector('.sidebar');
  const fab = ensureFiltersFab();

  if (sidebar) {
    ensureFiltersHeader(sidebar);
    fab?.addEventListener('click', () => openFiltersSheet(sidebar, fab));

    const closeBtn = sidebar.querySelector('[data-action="close-filters"]');
    closeBtn?.addEventListener('click', () => closeFiltersSheet(sidebar, fab));

    const applyBtn = sidebar.querySelector('.btn-apply');
    applyBtn?.addEventListener('click', () => closeFiltersSheet(sidebar, fab));
  }

  // Close drawer on nav link click
  navDrawer.querySelectorAll('a[href]').forEach(a => {
    a.addEventListener('click', () => closeAllOverlays());
  });

  const navCloseBtn = navDrawer.querySelector('[data-action="close-nav"]');
  navCloseBtn?.addEventListener('click', () => closeNavDrawer(navDrawer, hamburgerBtn));

  function closeAllOverlays() {
    closeNavDrawer(navDrawer, hamburgerBtn);
    if (sidebar) closeFiltersSheet(sidebar, fab);
  }
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
  const links = [...document.querySelectorAll('.nav-links a')];
  links.forEach(link => linksWrap.appendChild(link.cloneNode(true)));

  drawer.appendChild(header);
  drawer.appendChild(linksWrap);
  document.body.appendChild(drawer);
  return drawer;
}

function ensureHamburgerButton() {
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

  const navInner = document.querySelector('.nav-inner');
  const logo = document.querySelector('.nav-logo');
  if (navInner) {
    if (logo) navInner.insertBefore(btn, logo);
    else navInner.prepend(btn);
  }
  return btn;
}

function openNavDrawer(drawer, hamburgerBtn) {
  if (!drawer) return;
  closeFiltersSheet(document.querySelector('.sidebar'), document.querySelector('.filters-fab'));
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
  if (!document.querySelector('.sidebar.is-open')) setModalOpen(false);
}

function ensureFiltersFab() {
  let fab = document.querySelector('.filters-fab');
  if (fab) return fab;

  fab = document.createElement('button');
  fab.className = 'filters-fab';
  fab.type = 'button';
  fab.setAttribute('aria-label', 'Open filters');
  fab.setAttribute('aria-expanded', 'false');
  fab.innerHTML = `
    <svg class="fab-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
    Filters
  `;

  document.body.appendChild(fab);
  return fab;
}

function ensureFiltersHeader(sidebar) {
  if (sidebar.querySelector('.sheet-header')) return;

  const header = document.createElement('div');
  header.className = 'sheet-header';
  header.innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-title-row">
      <h3>Filters</h3>
      <button class="drawer-close" type="button" aria-label="Close filters" data-action="close-filters">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `;
  sidebar.insertBefore(header, sidebar.firstChild);
}

function openFiltersSheet(sidebar, fab) {
  if (!sidebar) return;
  closeNavDrawer(document.getElementById('navDrawer'), document.getElementById('navHamburger'));
  sidebar.classList.add('is-open');
  fab?.setAttribute('aria-expanded', 'true');
  setModalOpen(true);
}

function closeFiltersSheet(sidebar, fab) {
  if (!sidebar) return;
  sidebar.classList.remove('is-open');
  fab?.setAttribute('aria-expanded', 'false');
  if (!document.querySelector('#navDrawer.is-open')) setModalOpen(false);
}

setupFilters();
setupMobileUI();
