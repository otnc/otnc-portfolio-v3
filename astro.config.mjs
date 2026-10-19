// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflarePages from 'astro-adapter-cloudflare-pages';

export default defineConfig({
	site: 'https://otoneko.cat',
	output: 'server',
	adapter: cloudflarePages(),
	integrations: [react()],
	vite: {
		plugins: [tailwindcss()],
	},
});
