/// <reference types="astro/client" />

/** Bindings and secrets configured on the Cloudflare Pages project. */
interface Env {
	/** Optional. Raises the GitHub API limit used to read repository homepages. */
	GITHUB_TOKEN?: string;
}

type Runtime = import('astro-adapter-cloudflare-pages').Runtime<Env>;

declare namespace App {
	interface Locals extends Runtime {}
}
