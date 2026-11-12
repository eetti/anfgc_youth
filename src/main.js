const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('is-open', open);
});
nav.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width: 761px)').addEventListener('change', closeMenu);
document.querySelector('#year').textContent = new Date().getFullYear();

import events from './events.json';
import { initializeMaps } from './map';
const list = document.querySelector('#event-list');
if (list) {
 for (const event of events) {
  const card = document.createElement('article');
  card.className = 'event-card';
  const schedule = document.createElement('p'); schedule.className='event-schedule'; schedule.textContent=event.schedule;
  const title = document.createElement('h3'); title.textContent=event.title;
  const summary = document.createElement('p'); summary.textContent=event.summary;
  const address = document.createElement('p'); address.textContent=event.address;
  const link = document.createElement('a'); link.className='text-link'; link.href=`/events/${event.slug}.html`; link.textContent='View event details →'; link.setAttribute('aria-label', `View details: ${event.title}`);
  card.append(schedule,title,summary,address,link); list.append(card);
 }
}
initializeMaps();
