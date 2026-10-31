export type Placement = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'left' | 'center' | 'right';

/**
 * Classes for an absolutely-positioned floating panel relative to a `relative` wrapper.
 * The padding (rather than margin) bridges the gap so hover menus don't close while the
 * pointer travels from trigger to panel.
 */
export function floatingClasses(placement: Placement, align: Align = 'left'): string {
	const vertical: Record<Align, string> = {
		left: 'left-0',
		center: 'left-1/2 -translate-x-1/2',
		right: 'right-0'
	};
	switch (placement) {
		case 'top':
			return `bottom-full pb-2 ${vertical[align]}`;
		case 'bottom':
			return `top-full pt-2 ${vertical[align]}`;
		case 'left':
			return 'right-full top-1/2 -translate-y-1/2 pr-2';
		case 'right':
			return 'left-full top-1/2 -translate-y-1/2 pl-2';
	}
}
