import { Dithering, ImageDithering } from '@paper-design/shaders-react';

interface BackgroundProps {
	colorBack?: string;
	colorFront?: string;
}

interface AvatarProps {
	avatar: string;
	colorBack?: string;
	colorFront?: string;
	colorHighlight?: string;
}

export function OceanBackground({ colorBack = '#0b1530', colorFront = '#2f6fd6' }: BackgroundProps) {
	return (
		<Dithering
			style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
			colorBack={colorBack}
			colorFront={colorFront}
			shape="wave"
			type="4x4"
			size={3}
			speed={0.4}
		/>
	);
}

export function DitheredAvatar({
	avatar,
	colorBack = '#0b1530',
	colorFront = '#5ee1ff',
	colorHighlight = '#fff6d5',
}: AvatarProps) {
	return (
		<ImageDithering
			style={{ width: '100%', height: '100%' }}
			image={avatar}
			colorBack={colorBack}
			colorFront={colorFront}
			colorHighlight={colorHighlight}
			type="4x4"
			size={2}
			colorSteps={2}
			fit="cover"
		/>
	);
}
