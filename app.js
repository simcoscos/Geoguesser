const MAP_CENTER = [0, 0];
let map, marker, actual, score = 0, round = 0;
let photos = [];

async function loadPhotos() {
  const res = await fetch('data/photos.json');
  photos = await res.json();
}

function initMap() {
  map = L.map('map').setView(MAP_CENTER, 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  map.on('click', onMapClick);
}

function showPhoto() {
  if (round >= photos.length) {
    document.getElementById('score').textContent = `Game over! Final score: ${score}`;
    document.getElementById('guessBtn').disabled = true;
    return;
  }
  actual = photos[round];
  document.getElementById('photo').src = actual.file;
}

function onMapClick(e) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker(e.latlng).addTo(map);
}

function distance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // metres
  const phi1 = lat1 * Math.PI/180;
  const phi2 = lat2 * Math.PI/180;
  const dphi = (lat2-lat1) * Math.PI/180;
  const dlambda = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dphi/2) * Math.sin(dphi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dlambda/2) * Math.sin(dlambda/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c / 1000; // distance in km
}

function scoreFromDistance(dist) {
  if (dist < 1) return 5000;
  if (dist < 10) return Math.round(3000 - dist * 200);
  if (dist < 50) return Math.round(1000 - dist * 10);
  return 0;
}

function guess() {
  if (!marker) {
    alert('Please select a location on the map!');
    return;
  }
  const latlng = marker.getLatLng();
  const dist = distance(latlng.lat, latlng.lng, actual.lat, actual.lng);
  const points = Math.max(0, scoreFromDistance(dist));
  score += points;
  document.getElementById('score').textContent = `Round ${round+1}: You were ${dist.toFixed(2)} km away. Points: ${points}. Total: ${score}`;
  round++;
  marker && map.removeLayer(marker);
  marker = null;
  showPhoto();
}

document.getElementById('guessBtn').addEventListener('click', guess);

window.addEventListener('load', async () => {
  await loadPhotos();
  initMap();
  showPhoto();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
  }
});
