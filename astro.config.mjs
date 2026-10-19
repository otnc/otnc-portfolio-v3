// @ts-check
import { defineConfig } from 'astro/config';
import cloudflarePages from 'astro-adapter-cloudflare-pages';

export default defineConfig({
	site: 'https://otoneko.cat',
	output: 'server',
	// The custom entry redirects alternate hostnames; public/_routes.json sends every page (not static files) through it.
	adapter: cloudflarePages({ workerEntryPoint: './src/worker.ts' }),
});
