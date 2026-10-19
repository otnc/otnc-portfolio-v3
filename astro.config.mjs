// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflarePages from 'astro-adapter-cloudflare-pages';

export default defineConfig({
	site: 'https://otoneko.cat',
	output: 'server',
	// The custom entry redirects alternate hostnames; public/_routes.json sends every page (not static files) through it.
	adapter: cloudflarePages({ workerEntryPoint: './src/worker.ts' }),
	integrations: [react()],
	vite: {
		plugins: [tailwindcss()],
	},
});
