// ── MAP SETUP ──
const pharmacyCoords = [5.6037, -0.1870];
const homeCoords     = [5.6180, -0.1730];
let courierPos       = [5.6080, -0.1810];

const map = L.map('map', { zoomControl: false, attributionControl: true });

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '© OpenStreetMap © CARTO',
  maxZoom: 19
}).addTo(map);

map.setView([5.6110, -0.1780], 15);

// Ensure Leaflet renders correctly after responsive layout changes
let __invalidateT;
function invalidateMapSize() {
  clearTimeout(__invalidateT);
  __invalidateT = setTimeout(() => map.invalidateSize(), 150);
}
window.addEventListener('load', () => invalidateMapSize());
window.addEventListener('resize', () => invalidateMapSize());

// ── CUSTOM ICONS ──
const courierIcon = L.divIcon({
  html: `<div style="width:38px;height:38px;background:#2563EB;border-radius:50%;border:3px solid white;
    box-shadow:0 2px 8px rgba(37,99,235,0.5);display:flex;align-items:center;justify-content:center;">
    <svg width="18" height="18" viewBox="0 0 20 20" fill="white">
      <rect x="2" y="7" width="16" height="10" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2H6a2 2 0 00-2 2v2" stroke="white" stroke-width="1.8" fill="none"/>
    </svg>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  className: ''
});

const homeIcon = L.divIcon({
  html: `<div style="background:#1f2937;border-radius:8px;padding:5px 10px;color:white;font-size:11px;
    font-weight:700;white-space:nowrap;font-family:'DM Sans',sans-serif;
    box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;gap:5px">
    <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
      <path d="M3 9.5L10 3l7 6.5V18a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    </svg>My Home
  </div>`,
  iconSize: [90, 28],
  iconAnchor: [45, 28],
  className: ''
});

const pharmacyIcon = L.divIcon({
  html: `<div style="background:#16A34A;border-radius:8px;padding:5px 10px;color:white;font-size:11px;
    font-weight:700;white-space:nowrap;font-family:'DM Sans',sans-serif;
    box-shadow:0 2px 8px rgba(22,163,74,0.35);display:flex;align-items:center;gap:5px">
    <svg width="10" height="10" viewBox="0 0 20 20" fill="white">
      <rect x="3" y="3" width="14" height="14" rx="2"/>
      <path d="M10 7v6M7 10h6" stroke="white" stroke-width="2" fill="none"/>
    </svg>Pharmacy
  </div>`,
  iconSize: [95, 28],
  iconAnchor: [47, 14],
  className: ''
});

// ── ADD MARKERS ──
L.marker(homeCoords, { icon: homeIcon }).addTo(map);
L.marker(pharmacyCoords, { icon: pharmacyIcon }).addTo(map);
const courierMarker = L.marker(courierPos, { icon: courierIcon }).addTo(map);

// ── DASHED ROUTE ──
const routePoints = [
  pharmacyCoords,
  [5.6050, -0.1830],
  [5.6070, -0.1800],
  [5.6090, -0.1775],
  courierPos,
  [5.6120, -0.1760],
  [5.6150, -0.1745],
  homeCoords
];

L.polyline(routePoints, {
  color: '#2563EB',
  weight: 3,
  opacity: 0.7,
  dashArray: '8, 10',
  lineJoin: 'round'
}).addTo(map);

// ── ANIMATE COURIER ──
let step = 0;
const animPath = [
  [5.6080, -0.1810],
  [5.6090, -0.1795],
  [5.6100, -0.1782],
  [5.6110, -0.1770],
  [5.6125, -0.1758],
  [5.6140, -0.1748],
  [5.6155, -0.1740],
  [5.6170, -0.1735],
  homeCoords
];
const etaLabels = [
  '8 min away', '7 min away', '6 min away', '5 min away',
  '4 min away', '3 min away', '2 min away', '1 min away', 'Arrived!'
];

function animateCourier() {
  if (step >= animPath.length) return;
  courierMarker.setLatLng(animPath[step]);
  document.getElementById('etaMinutes').textContent = etaLabels[step];
  step++;
  setTimeout(animateCourier, 4000);
}
setTimeout(animateCourier, 2000);

// ── MAP HELPERS ──
function recenterMap() {
  map.flyTo(courierMarker.getLatLng(), 15, { duration: 1.2 });
}

// ── TOAST ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── NANIPAL ──
function closeNanipal() {
  document.getElementById('nanipalPopup').style.display = 'none';
}

function nanipalAction(msg) {
  closeNanipal();
  showToast(msg);
}

// Show Nanipal after 3 seconds
setTimeout(() => {
  const p = document.getElementById('nanipalPopup');
  p.style.display = 'block';
}, 3000);

// ── RESCHEDULE MODAL ──
function openReschedule() {
  const modal = document.getElementById('rescheduleModal');
  modal.style.display = 'flex';
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('rescheduleDate').min = today;
  document.getElementById('rescheduleDate').value = today;
}

function closeModal() {
  document.getElementById('rescheduleModal').style.display = 'none';
}

function confirmReschedule() {
  const d = document.getElementById('rescheduleDate').value;
  const t = document.getElementById('rescheduleTime').value;
  closeModal();
  showToast(`Rescheduled for ${d} at ${t}`);
}

// Close modal when clicking backdrop
document.getElementById('rescheduleModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
