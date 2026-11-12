import { defineConfig } from 'vite';
import events from './src/events.json' with { type: 'json' };
export default defineConfig({
  plugins: [],
  build: { rollupOptions: { input: ['index.html', ...events.map(event => `events/${event.slug}.html`)] } }
});
