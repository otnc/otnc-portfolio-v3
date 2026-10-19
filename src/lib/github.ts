// GitHub has no official API for pinned repositories, so this uses the same unofficial one as portfolio-v3.
const PINNED_API_URL = 'https://pinned.berrysauce.dev/get';
const REPO_API_URL = 'https://api.github.com/repos';
const CACHE_SECONDS = 60 * 60;

export interface PinnedWork {
	name: string;
	owner: string;
	repo: string;
	description: string;
	language?: { name: string; color: string };
	stars?: number;
	/** The repository's "Website" field on GitHub, if set. */
	homepage?: string;
}

interface PinnedItem {
	author?: unknown;
	name?: unknown;
	description?: unknown;
	language?: unknown;
	languageColor?: unknown;
	stars?: unknown;
}

/** Fetch options that let the Cloudflare edge cache the response; the `cf` key is ignored elsewhere. */
function cachedFetch(url: string, headers: Record<string, string> = {}) {
	return fetch(url, {
		headers,
		cf: { cacheTtl: CACHE_SECONDS, cacheEverything: true },
	} as RequestInit);
}

/**
 * The pinned API does not return the homepage, so it comes from the GitHub REST API. Unauthenticated calls
 * are limited to 60 per hour per IP (shared on Cloudflare), so pass a token when one is configured.
 * A failure just means no Link is shown.
 */
async function fetchHomepage(owner: string, name: string, token?: string) {
	try {
		const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'otoneko.cat' };
		if (token) headers.Authorization = `Bearer ${token}`;
		const response = await cachedFetch(`${REPO_API_URL}/${owner}/${name}`, headers);
		if (!response.ok) return undefined;
		const data: { homepage?: unknown } = await response.json();
		return typeof data.homepage === 'string' && data.homepage ? data.homepage : undefined;
	} catch {
		return undefined;
	}
}

async function fetchPinnedItems(user: string): Promise<PinnedItem[]> {
	const response = await cachedFetch(`${PINNED_API_URL}/${user}`);
	if (!response.ok) throw new Error(`pinned API responded ${response.status}`);
	const items: unknown = await response.json();
	if (!Array.isArray(items) || items.length === 0) throw new Error('no pinned repositories');
	return items;
}

/**
 * Pinned repositories of `user` with their GitHub description and homepage.
 * Returns an empty list when the pinned API is unavailable, so the page still renders.
 */
export async function fetchPinnedWorks(user: string, token?: string): Promise<PinnedWork[]> {
	let items: PinnedItem[];
	try {
		items = await fetchPinnedItems(user);
	} catch {
		return [];
	}

	return Promise.all(
		items.map(async (item) => {
			const owner = String(item.author ?? user);
			const name = String(item.name ?? '');
			const language = typeof item.language === 'string' ? item.language : undefined;
			return {
				name,
				owner,
				repo: `https://github.com/${owner}/${name}`,
				description: String(item.description ?? ''),
				stars: typeof item.stars === 'number' ? item.stars : undefined,
				language: language
					? { name: language, color: typeof item.languageColor === 'string' ? item.languageColor : '#a9b3dd' }
					: undefined,
				homepage: await fetchHomepage(owner, name, token),
			};
		}),
	);
}
