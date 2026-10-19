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

export interface Work {
	name: string;
	kind: string;
	description: string;
	url: string;
	repo: string;
}

export const profile = {
	name: '音猫｡',
	nameLatin: 'otoneko.',
	reading: 'おとねこ',
	handle: 'otnc',
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
	communities: [
		{ name: 'Oto Home', role: '主宰', url: 'https://github.com/oto-home' },
		// The widget invite rotates, so no stable URL is linked here yet.
		{ name: 'Evex Developers', role: 'スタッフ', url: undefined },
	] as { name: string; role: string; url?: string }[],
};

export const works: Work[] = [
	{
		name: 'hono-feed',
		kind: 'npm',
		description: 'Hono で RSS / Atom / JSON Feed をちゃんと出すためのライブラリ。',
		url: 'https://www.npmjs.com/package/hono-feed',
		repo: 'https://github.com/otnc/hono-feed',
	},
	{
		name: 'makeitaquote',
		kind: 'npm',
		description: '「Make it a Quote」画像をローカルで生成する。',
		url: 'https://www.npmjs.com/package/makeitaquote',
		repo: 'https://github.com/otnc/makeitaquote',
	},
	{
		name: 'Package License Viewer',
		kind: 'VS Code',
		description: '依存パッケージのライセンスを、行末に薄く表示する VS Code 拡張。',
		url: 'https://marketplace.visualstudio.com/items?itemName=otoneko1102.package-license-viewer',
		repo: 'https://github.com/otnc/package-license-viewer',
	},
	{
		name: 'dowa',
		kind: 'npm',
		description: 'どわーw (冷笑) を検知する。Twitter 用のブラウザ拡張もある。',
		url: 'https://www.npmjs.com/package/dowa',
		repo: 'https://github.com/otnc/dowa',
	},
	{
		name: 'Better GitHub Utils',
		kind: 'Chrome',
		description: 'フォローされているかの表示や、ホームのアクティビティフィードの復活など、GitHub を少し便利にする拡張。',
		url: 'https://chromewebstore.google.com/detail/ddpmlpfdiafndnkdhbopgcmnckngfbgm',
		repo: 'https://github.com/otnc/better-github-utils',
	},
	{
		name: 'uustupid',
		kind: 'Web',
		description: 'UUID の形をしているけど、決して UUID ではないもの。',
		url: 'https://uustupid.otnc.dev/',
		repo: 'https://github.com/otnc/uustupid',
	},
];

export const accounts: Account[] = [
	{ label: 'GitHub', handle: 'otnc', url: 'https://github.com/otnc', icon: 'github' },
	{ label: 'Twitter', handle: '@rin_pineapple', url: 'https://twitter.com/rin_pineapple', icon: 'twitter' },
	{ label: 'Misskey', handle: '@o@misskey.otnc.dev', url: 'https://misskey.otnc.dev/@o', icon: 'misskey' },
];

// Shown as a special "warp" section rather than in the account list.
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

export interface Demo {
	slug: string;
	title: string;
	library: string;
	libraryUrl: string;
	usesTailwind: boolean;
	usesReact: boolean;
	note: string;
}

export const demos: Demo[] = [
	{
		slug: '8bitcn',
		title: '8bitcn/ui',
		library: '8bitcn/ui',
		libraryUrl: 'https://www.8bitcn.com/',
		usesTailwind: true,
		usesReact: true,
		note: 'ゲーム画面っぽい部品 (HP バー、XP バー) が豊富。shadcn ベース。',
	},
	{
		slug: 'pixelact',
		title: 'Pixelact UI',
		library: 'Pixelact UI',
		libraryUrl: 'https://www.pixelactui.com/',
		usesTailwind: true,
		usesReact: true,
		note: '影で描くピクセル枠がきれい。部品は少なめ。shadcn ベース。',
	},
	{
		slug: 'retroui',
		title: 'RetroUI',
		library: 'pixel-retroui',
		libraryUrl: 'https://retroui.io/',
		usesTailwind: false,
		usesReact: true,
		note: '参考に挙がった本家。CSS 同梱なので Tailwind なしで動く。更新は 2025-05 で止まっている。',
	},
	{
		slug: 'nes-css',
		title: 'NES.css',
		library: 'NES.css',
		libraryUrl: 'https://nostalgic-css.github.io/NES.css/',
		usesTailwind: false,
		usesReact: false,
		note: 'ファミコン風の素の CSS。JS 不要でいちばん軽い。',
	},
	{
		slug: 'handmade',
		title: '自作 CSS + Paper Shaders',
		library: 'Paper Shaders',
		libraryUrl: 'https://shaders.paper.design',
		usesTailwind: false,
		usesReact: true,
		note: 'ライブラリに頼らず CSS でドット枠を描き、アイコンをディザリングシェーダーでドット化。',
	},
];
