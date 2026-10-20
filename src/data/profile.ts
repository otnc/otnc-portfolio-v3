import type { PixelIconName } from '@/data/pixel-icons';

export const SITE_ORIGIN = 'https://otoneko.cat';

export interface LinkItem {
	label: string;
	handle: string;
	url: string;
}

export interface Account extends LinkItem {
	icon: PixelIconName;
}

export const profile = {
	name: '音猫｡',
	nameLatin: 'otoneko.',
	handle: 'otnc',
	twitter: '@rin_pineapple',
	avatar: 'https://avatars.githubusercontent.com/u/116952822?v=4&s=400',
	tagline: '海を潜っています:)',
	// Scrolled across the banner under the hero.
	messages: [
		'otoneko.cat へようこそ',
		'海を潜っています:)',
		'ネタ駆動で開発しています',
		'便利とロマンをシェアしよう',
		'思い立ったが吉日',
		'気になった作品があれば GitHub で ★ を',
		'大学・日常・技術の話は まろん｡ のほうで',
		'ゆっくりしていってね',
	],
	roles: ['ネタ駆動開発', 'フルスタック?な開発者', 'おもしろOSS開発者', 'OSSコントリビューター', '開発者コミュニティのスタッフ'],
	bio: 'ネタ駆動で開発しています。npm パッケージ、ブラウザ拡張、VS Code 拡張、Discord Bot など、便利なものから、使い道のないただの一発ネタまで作っています。',
	skills: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'CoffeeScript', 'Python', 'Ruby', 'Go', 'React', 'Node.js', 'Astro', 'Svelte'],
	lab: { name: 'Oto Lab', role: '個人の開発用 Organization', url: 'https://github.com/oto-lab' },
};

export const accounts: Account[] = [
	{ label: 'GitHub', handle: 'otnc', url: 'https://github.com/otnc', icon: 'github' },
	{ label: 'Twitter', handle: '@rin_pineapple', url: 'https://twitter.com/rin_pineapple', icon: 'twitter' },
	{ label: 'Misskey', handle: '@o@misskey.otnc.dev', url: 'https://misskey.otnc.dev/@o', icon: 'misskey' },
];

// Linked from the bottle mail rather than the account list.
export const altPersona = {
	name: 'まろん｡',
	topics: '大学・日常・技術',
	summary: '大学・日常・技術の話は、もうひとりのわたし「まろん｡」のほうで。',
	twitter: { handle: '@rin_montblank', url: 'https://twitter.com/rin_montblank' },
	site: { label: 'montblank.fun', url: 'https://montblank.fun' },
};

export const supports: LinkItem[] = [
	{ label: 'GitHub Sponsors', handle: 'otnc', url: 'https://github.com/sponsors/otnc' },
	{ label: 'Buy Me a Coffee', handle: 'devuloper', url: 'https://www.buymeacoffee.com/devuloper' },
	{ label: 'Ko-fi', handle: 'E1E41LY2C9', url: 'https://ko-fi.com/E1E41LY2C9' },
];
