// Draws the thumbnail (used as the OGP image), the link banners and the favicon in the site's style, with PixelMplus text taken from the bundled font files.
// Runs before every dev server and build, so the images always match the current profile and avatar.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import * as fontkit from 'fontkit';
import sharp from 'sharp';

// The same avatar the site dithers in the hero.
const AVATAR = new URL('../public/avatar.png', import.meta.url);
const OUT = new URL('../public/', import.meta.url);

const C = {
	sky: '#070b22',
	sea1: '#0b1638',
	sea2: '#12245a',
	sea3: '#1c3a86',
	window: '#0d1533',
	bar: '#1c3a86',
	frame: '#fff6d5',
	moon: '#fff6d5',
	moonEdge: '#f5e3a0',
	crater: '#e8d48a',
	gold: '#ffe08a',
	cyan: '#5ee1ff',
	ink: '#0a0f26',
};

const fonts = {
	10: fontkit.create(await readFile(new URL('../fonts/pixelmplus/PixelMplus10-Regular.ttf', import.meta.url))),
	12: fontkit.create(await readFile(new URL('../fonts/pixelmplus/PixelMplus12-Regular.ttf', import.meta.url))),
};

/**
 * SVG for `text` set in PixelMplus at `scale` times its native grid (10 or 12 px), with the baseline at `y`.
 * Keep `x`, `y` and the size integral so every font pixel lands on whole device pixels.
 */
function text(content, { grid, scale, x, y, fill }) {
	const font = fonts[grid];
	const size = grid * scale;
	const unit = size / font.unitsPerEm;
	const run = font.layout(content);
	let cursor = x;
	let out = '';
	run.glyphs.forEach((glyph, index) => {
		const d = glyph.path.toSVG();
		if (d) out += `<path transform="translate(${cursor} ${y}) scale(${unit} ${-unit})" d="${d}" fill="${fill}"/>`;
		cursor += run.positions[index].xAdvance * unit;
	});
	return { svg: out, width: cursor - x };
}

/** Rectangles for a grid of colour keys, merging horizontal runs. `cell` is the drawn size of one grid square. */
function grid(rows, colors, { x, y, cell }) {
	let out = '';
	rows.forEach((row, ry) => {
		let rx = 0;
		while (rx < row.length) {
			const key = row[rx];
			let end = rx + 1;
			while (end < row.length && row[end] === key) end += 1;
			if (colors[key]) {
				out += `<rect x="${x + rx * cell}" y="${y + ry * cell}" width="${(end - rx) * cell}" height="${cell}" fill="${colors[key]}"/>`;
			}
			rx = end;
		}
	});
	return out;
}

function moon(size) {
	const radius = size / 2 - 0.5;
	return Array.from({ length: size }, (_, y) =>
		Array.from({ length: size }, (_, x) => {
			const distance = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2);
			if (distance > radius) return '.';
			if (size >= 16 && [`${Math.round(size * 0.3)},${Math.round(size * 0.3)}`, `${Math.round(size * 0.65)},${Math.round(size * 0.55)}`].includes(`${x},${y}`)) return 'c';
			return distance > radius - 1.5 && x > size / 2 ? 'e' : 'm';
		}).join(''),
	);
}

// Seeded so the images are identical on every run.
function random(seed) {
	let state = seed;
	return () => {
		state = (state * 1664525 + 1013904223) % 4294967296;
		return state / 4294967296;
	};
}

/** Height (in dots) of a smooth wavy boundary at column x, the same shape family as public/pixel/edge-*.svg. */
const wave = (x, width, phase) => Math.round(1.6 * Math.sin((2 * Math.PI * x) / width + phase) + 0.9 * Math.sin((4 * Math.PI * x) / width + phase * 2.3));

/** Bands of sea colour from `top` (in dots) down, each with a wavy upper edge. */
function sea({ widthDots, top, bands, dot }) {
	let out = '';
	let y = top;
	bands.forEach(([color, height], index) => {
		for (let x = 0; x < widthDots; x += 1) {
			const lift = wave(x, 64, index * 2.1) + 2;
			out += `<rect x="${x * dot}" y="${(y - lift) * dot}" width="${dot}" height="${(height + lift + 200) * dot}" fill="${color}"/>`;
		}
		y += height;
	});
	return out;
}

/**
 * The avatar, dithered like the site: line art goes dark navy and the rest is an ordered (Bayer 4x4) mix of cyan and cream.
 * Dark strokes are thickened first so thin lines survive the reduction.
 */
async function ditheredAvatar(avatar, cells) {
	const big = cells * 2;
	const { data } = await sharp(avatar).resize(big, big, { fit: 'cover' }).greyscale().normalise().raw().toBuffer({ resolveWithObject: true });
	const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
	const rows = [];
	for (let y = 0; y < cells; y += 1) {
		let row = '';
		for (let x = 0; x < cells; x += 1) {
			// Minimum over each 2x2 block of the 2x image: shrinks without losing thin dark lines.
			let value = 255;
			for (let dy = 0; dy <= 1; dy += 1) {
				for (let dx = 0; dx <= 1; dx += 1) {
					const sx = Math.min(big - 1, Math.max(0, x * 2 + dx));
					const sy = Math.min(big - 1, Math.max(0, y * 2 + dy));
					value = Math.min(value, data[sy * big + sx]);
				}
			}
			const v = value / 255;
			if (v < 0.42) row += 'i';
			// Mostly cyan with cream mixed into the brightest areas, matching the shader on the site.
			else row += ((v - 0.42) / 0.58) * 0.55 > (bayer[(y % 4) * 4 + (x % 4)] + 0.5) / 16 ? 'w' : 'c';
		}
		rows.push(row);
	}
	return rows;
}

/**
 * The avatar for the small link banners.
 * Dithering turns into noise at this size, so the head is cropped and any cell that touches a line becomes a solid navy dot on plain cyan.
 * Resizing first would average the thin strokes away, so each cell counts the dark pixels of its block in the full-size image instead.
 */
async function bannerAvatar(avatar, cells, { inkShare = 0.42, crop = { left: 0.04, top: 0.02, side: 0.8 } } = {}) {
	const { width } = await sharp(avatar).metadata();
	const side = Math.round(width * crop.side);
	const { data } = await sharp(avatar)
		.extract({ left: Math.round(width * crop.left), top: Math.round(width * crop.top), width: side, height: side })
		.greyscale()
		.raw()
		.toBuffer({ resolveWithObject: true });
	const block = side / cells;
	return Array.from({ length: cells }, (_, y) =>
		Array.from({ length: cells }, (_, x) => {
			let dark = 0;
			let total = 0;
			for (let sy = Math.floor(y * block); sy < Math.floor((y + 1) * block); sy += 1) {
				for (let sx = Math.floor(x * block); sx < Math.floor((x + 1) * block); sx += 1) {
					total += 1;
					if (data[sy * side + sx] < 160) dark += 1;
				}
			}
			return dark / total > inkShare ? 'i' : 'c';
		}).join(''),
	);
}

/** An old-OS window: cream frame, striped title bar with icon, title and the three buttons, and a body slot. */
function windowFrame({ x, y, width, bodyHeight, title, dot, titleScale }) {
	const bar = 6 * dot;
	const border = dot;
	const height = bar + bodyHeight + border * 3;
	let out = `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${C.frame}"/>`;
	out += `<rect x="${x + border}" y="${y + border}" width="${width - border * 2}" height="${bar}" fill="${C.bar}"/>`;
	for (let sy = y + border + dot; sy < y + border + bar; sy += dot * 2) {
		out += `<rect x="${x + border}" y="${sy}" width="${width - border * 2}" height="${dot / 2}" fill="#183277"/>`;
	}
	out += `<rect x="${x + border * 3}" y="${y + border + 2 * dot}" width="${2 * dot}" height="${2 * dot}" fill="${C.cyan}"/>`;
	out += text(title, { grid: 10, scale: titleScale, x: x + border * 3 + 4 * dot, y: y + border + bar - dot - Math.round(titleScale), fill: C.moon }).svg;
	for (let index = 0; index < 3; index += 1) {
		const bx = x + width - border * 3 - (3 - index) * 4 * dot;
		out += `<rect x="${bx}" y="${y + border + dot}" width="${3 * dot}" height="${4 * dot}" fill="${C.moon}"/>`;
		out += `<rect x="${bx + dot}" y="${y + border + 3 * dot}" width="${dot}" height="${dot}" fill="${C.ink}"/>`;
	}
	out += `<rect x="${x + border}" y="${y + border * 2 + bar}" width="${width - border * 2}" height="${bodyHeight}" fill="${C.window}"/>`;
	return { svg: out, bodyX: x + border, bodyY: y + border * 2 + bar, height };
}

function svgDocument(width, height, body) {
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">${body}</svg>`;
}

async function writePng(path, svg) {
	await mkdir(new URL('.', new URL(path, OUT)), { recursive: true });
	await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(new URL(path, OUT).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
	console.log(`wrote public/${path}`);
}

async function writeSvg(path, svg) {
	await writeFile(new URL(path, OUT), svg);
	console.log(`wrote public/${path}`);
}

const avatar = await readFile(AVATAR);
const avatarColors = { i: C.ink, c: C.cyan, w: C.frame };

// ---- Thumbnail: 1200x630, 6px dots ----
{
	const dot = 6;
	const W = 1200;
	const H = 630;
	const rand = random(20061102);
	let body = `<rect width="${W}" height="${H}" fill="${C.sky}"/>`;
	for (let index = 0; index < 60; index += 1) {
		const size = rand() < 0.2 ? dot : dot / 2;
		body += `<rect x="${Math.round((rand() * W) / 3) * 3}" y="${Math.round((rand() * 330) / 3) * 3}" width="${size}" height="${size}" fill="${C.moon}" opacity="${(0.5 + rand() * 0.5).toFixed(2)}"/>`;
	}
	body += sea({ widthDots: W / dot, top: 62, dot, bands: [[C.sea1, 14], [C.sea2, 14], [C.sea3, 30]] });
	body += grid(moon(24), { m: C.moon, e: C.moonEdge, c: C.crater }, { x: 996, y: 42, cell: dot });
	for (let index = 0; index < 9; index += 1) {
		const width = (4 + index * 2) * dot;
		body += `<rect x="${1068 - width / 2 + ((index * 37) % 3) * dot - dot}" y="${390 + index * 3 * dot}" width="${width}" height="${dot / 2}" fill="${C.moon}" opacity="0.7"/>`;
	}

	const avatarCells = 100;
	const cell = 3;
	const frame = windowFrame({ x: 90, y: 120, width: avatarCells * cell + dot * 2, bodyHeight: avatarCells * cell, title: 'otoneko.png', dot, titleScale: 3 });
	body += `<rect x="${90 + 12}" y="${120 + 12}" width="${avatarCells * cell + dot * 2}" height="${frame.height}" fill="#000" opacity="0.4"/>`;
	body += frame.svg;
	body += grid(await ditheredAvatar(avatar, avatarCells), avatarColors, { x: frame.bodyX, y: frame.bodyY, cell });

	const left = 486;
	body += text('otoneko.', { grid: 12, scale: 8, x: left + 6, y: 256, fill: C.sea3 }).svg;
	body += text('otoneko.', { grid: 12, scale: 8, x: left, y: 250, fill: C.moon }).svg;
	body += text('音猫｡', { grid: 12, scale: 4, x: left, y: 324, fill: C.gold }).svg;

	const tagline = text('> 海を潜っています:)', { grid: 10, scale: 3, x: left + 24, y: 400, fill: C.moon });
	body += `<rect x="${left}" y="356" width="${tagline.width + 48}" height="60" fill="${C.frame}"/>`;
	body += `<rect x="${left + 6}" y="362" width="${tagline.width + 36}" height="48" fill="${C.ink}"/>`;
	body += tagline.svg;
	body += text('otoneko.cat', { grid: 10, scale: 4, x: left, y: 520, fill: C.cyan }).svg;

	await writePng('thumbnail.png', svgDocument(W, H, body));
}

// ---- Link banners ----
// `dot` is the size of one decorative dot, matched to the banner's text scale.
async function banner({ width, height, dot, avatarCells, name, url, path }) {
	let body = `<rect width="${width}" height="${height}" fill="${C.sky}"/>`;
	const rand = random(1102);
	for (let index = 0; index < width / 8; index += 1) {
		body += `<rect x="${Math.round((rand() * width) / dot) * dot}" y="${Math.round((rand() * height * 0.55) / dot) * dot}" width="${dot}" height="${dot}" fill="${C.moon}" opacity="0.8"/>`;
	}
	body += sea({ widthDots: width / dot, top: Math.round((height * 0.75) / dot), dot, bands: [[C.sea2, 3], [C.sea3, 20]] });
	const moonSize = height >= 40 ? 10 : 7;
	body += grid(moon(moonSize), { m: C.moon, e: C.moonEdge, c: C.crater }, { x: width - moonSize - 6, y: 4, cell: 1 });

	const pad = 4;
	body += `<rect x="${pad - 1}" y="${pad - 1}" width="${avatarCells + 2}" height="${avatarCells + 2}" fill="${C.frame}"/>`;
	body += grid(await bannerAvatar(avatar, avatarCells), { i: C.ink, c: C.cyan }, { x: pad, y: pad, cell: 1 });

	const left = pad + avatarCells + 6;
	body += name.svg(left);
	body += url.svg(left);
	// One-pixel cream border, like the window frames.
	body += `<rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" fill="none" stroke="${C.frame}" stroke-width="1"/>`;
	await writePng(path, svgDocument(width, height, body));
}

await banner({
	width: 200,
	height: 40,
	dot: 2,
	avatarCells: 32,
	path: 'banners/normal.png',
	name: { svg: (x) => text('otoneko.', { grid: 12, scale: 2, x: x + 1, y: 21, fill: C.ink }).svg + text('otoneko.', { grid: 12, scale: 2, x, y: 20, fill: C.moon }).svg },
	url: { svg: (x) => text('otoneko.cat', { grid: 10, scale: 1, x, y: 34, fill: C.cyan }).svg },
});

// ---- Favicon: the banner avatar inside a cream moon ring, transparent outside ----
{
	const size = 32;
	const inner = 26;
	// The whole head turns into specks at this size, so the favicon zooms in on the face, with a higher share so the eyes do not fill in.
	const face = await bannerAvatar(avatar, inner, { inkShare: 0.65, crop: { left: 0.22, top: 0.33, side: 0.42 } });
	const offset = (size - inner) / 2;
	const rows = Array.from({ length: size }, (_, y) =>
		Array.from({ length: size }, (_, x) => {
			const distance = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2);
			if (distance > size / 2 - 0.5) return '.';
			if (distance > size / 2 - 2.5) return 'm';
			return face[y - offset]?.[x - offset] ?? 'c';
		}).join(''),
	);
	const svg = svgDocument(size, size, grid(rows, { m: C.moon, i: C.ink, c: C.cyan }, { x: 0, y: 0, cell: 1 }));
	await writeSvg('favicon.svg', svg);
	await writePng('favicon.png', svg);
}
