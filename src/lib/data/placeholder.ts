/** Generates a lightweight SVG data-URI placeholder image (no network, no assets). */
export function placeholderImage(label: string, hue = 220, width = 800, height = 600): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="hsl(${hue} 70% 92%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360} 60% 80%)"/></linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<circle cx="${width * 0.72}" cy="${height * 0.3}" r="${height * 0.18}" fill="hsl(${hue} 60% 70% / .45)"/>
<rect x="${width * 0.18}" y="${height * 0.45}" width="${width * 0.4}" height="${height * 0.32}" rx="16" fill="hsl(${hue} 50% 60% / .35)"/>
<text x="50%" y="92%" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${Math.round(height / 16)}" fill="hsl(${hue} 40% 30%)">${label}</text>
</svg>`;
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
