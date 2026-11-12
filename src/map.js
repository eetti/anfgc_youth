import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Look up addresses only when a visitor requests a map. Cache successful results
// for 30 days and serialize requests to respect Nominatim's public-service limits.
let lookupQueue = Promise.resolve();
let lastLookup = 0;
const pending = new Map();
function locate(address) {
 if (pending.has(address)) return pending.get(address);
 const task = lookupQueue.then(async () => {
  const key = `any-venue-v1:${address}`;
  try {
   const saved = JSON.parse(localStorage.getItem(key));
   if (saved && Date.now() - saved.savedAt < 30 * 86400000 && validCoordinates(saved.coordinates)) return saved.coordinates;
  } catch { /* Storage may be disabled. The map still works. */ }
  await new Promise(resolve => setTimeout(resolve, Math.max(0, 1100 - (Date.now() - lastLookup))));
  lastLookup = Date.now();
  const query = new URLSearchParams({q:address,format:'jsonv2',limit:'1',countrycodes:'ca',addressdetails:'1'});
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {signal:AbortSignal.timeout(10000)});
  if (!response.ok) throw new Error('Address lookup unavailable');
  const [result] = await response.json();
  const coordinates = [Number(result?.lat),Number(result?.lon)];
  const houseNumber = address.match(/^\d+/)?.[0];
  if (!result || !validCoordinates(coordinates) || (houseNumber && result.address?.house_number !== houseNumber)) throw new Error('Exact address not found');
  try { localStorage.setItem(key, JSON.stringify({coordinates,savedAt:Date.now()})); } catch { /* Optional cache. */ }
  return coordinates;
 });
 lookupQueue = task.catch(() => {});
 pending.set(address, task);
 task.catch(() => pending.delete(address));
 return task;
}
function validCoordinates(value) {
 return Array.isArray(value) && value.length === 2 && value.every(Number.isFinite) && Math.abs(value[0]) <= 90 && Math.abs(value[1]) <= 180;
}
export function initializeMaps() {
 for (const element of document.querySelectorAll('.venue-map')) {
  const status = element.parentElement.querySelector('.map-status');
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'button map-load'; button.textContent = 'Show interactive map';
  element.hidden = true;
  element.before(button);
  status.textContent = 'Explore the location with OpenStreetMap, or use the directions link below.';
  button.addEventListener('click', async () => {
   button.disabled = true; status.textContent = 'Finding the meeting location…';
   let map;
   try {
    const coordinates = await locate(element.dataset.address);
    element.hidden = false;
    map = L.map(element,{scrollWheelZoom:false}).setView(coordinates,16);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
     maxZoom:19,
     attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    let failed = false;
    tiles.on('tileerror', () => { failed=true; status.textContent='Some map tiles could not load. Use the directions link below.'; });
    tiles.on('load', () => { if(!failed) status.textContent='Use the map controls to zoom, or open directions below.'; });
    tiles.addTo(map);
    const label=document.createElement('span'); label.textContent=element.dataset.address;
    L.marker(coordinates,{icon:L.divIcon({className:'venue-pin',html:'<span aria-hidden="true"></span>',iconSize:[26,26],iconAnchor:[13,26]}),alt:element.dataset.address}).addTo(map).bindPopup(label).openPopup();
    button.hidden = true;
    element.tabIndex = 0;
    element.focus();
   } catch {
    map?.remove(); element.hidden=true; button.disabled=false; button.textContent='Try loading the map again';
    status.textContent='The interactive map is unavailable. Use the directions link below to plan your visit.';
   }
  });
 }
}
