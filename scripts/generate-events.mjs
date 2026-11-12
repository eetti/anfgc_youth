import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
const events = JSON.parse(await readFile('src/events.json', 'utf8'));
const home = await readFile('index.html', 'utf8');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slugs = new Set();
for (const event of events) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug) || slugs.has(event.slug)) throw new Error('Invalid or duplicate event slug');
  slugs.add(event.slug);
  for (const key of ['title','schedule','timezone','address','summary','description','note']) if (typeof event[key] !== 'string' || !event[key].trim()) throw new Error(`Missing ${key} in ${event.slug}`);
}
await mkdir('events', { recursive: true });
// Only remove generated pages, never user-authored files.
for (const name of await readdir('events')) {
  if (name.endsWith('.html') && !slugs.has(name.slice(0,-5))) {
    const contents = await readFile(`events/${name}`, 'utf8');
    if(contents.startsWith('<!-- Generated from src/events.json -->')) await unlink(`events/${name}`);
  }
}
const header = home.match(/<header[\s\S]*?<\/header>/)[0].replaceAll('href="#', 'href="/#');
const footer = home.match(/<footer[\s\S]*?<\/footer>/)[0].replaceAll('href="#', 'href="/#');
for (const event of events) {
 const e = Object.fromEntries(Object.entries(event).map(([k,v])=>[k,escape(v)]));
 await writeFile(`events/${event.slug}.html`, `<!-- Generated from src/events.json -->
<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#dad2bc"><meta name="description" content="${e.summary}"><title>${e.title} — All Nations Youth</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/src/style.css"></head><body><a class="skip-link" href="#main">Skip to content</a>${header}<main id="main"><section class="section event-detail"><a class="text-link" href="/#events">← All events</a><p class="section-kicker">ALL NATIONS YOUTH / GATHER TOGETHER</p><h1>${e.title}</h1><p class="event-summary">${e.summary}</p><dl class="event-facts"><div><dt>WHEN</dt><dd>${e.schedule}<small>Halifax local time (Atlantic time)</small></dd></div><div><dt>WHERE</dt><dd>${e.address}</dd></div></dl><p>${e.description}</p><p>${e.note}</p><a class="text-link" href="https://www.instagram.com/any.hfx/">Connect on Instagram / @any.hfx</a></section><section class="section location-section" aria-labelledby="location-title"><h2 id="location-title">Meet us <em>here.</em></h2><p>${e.address}</p><div class="venue-map" data-address="${e.address}" role="region" aria-label="Map of ${e.address}"></div><p class="map-status" role="status">Loading map…</p><a class="text-link" href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(event.address)}">Get directions ↗</a><noscript><p>Enable JavaScript to use the interactive map, or use the directions link.</p></noscript></section></main>${footer}<script type="module" src="/src/main.js"></script></body></html>`);
}
console.log(`Generated ${events.length} event page(s).`);
