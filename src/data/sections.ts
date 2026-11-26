/** A place on a page that the header menu jumps to with `#id`. */
export interface PageSection {
	id: string;
	label: string;
}

// Each `id` must match the `id` given to the window, section or heading it points at.
export const topSections: PageSection[] = [
	{ id: 'about', label: 'About' },
	{ id: 'works', label: 'Works' },
	{ id: 'bottle', label: 'Bottle Mail' },
	{ id: 'links', label: 'Links' },
];

