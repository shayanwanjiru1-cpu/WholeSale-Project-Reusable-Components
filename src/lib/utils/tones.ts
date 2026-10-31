import type { IconName } from '$lib/components/ui/icons';

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/** Tinted background + strong text. Used by badges, alerts, notification cards. */
export const toneSoft: Record<Tone, string> = {
	neutral: 'bg-muted text-foreground',
	primary: 'bg-accent text-accent-foreground',
	success: 'bg-success-soft text-success-strong',
	warning: 'bg-warning-soft text-warning-strong',
	error: 'bg-danger-soft text-danger-strong',
	info: 'bg-info-soft text-info-strong'
};

export const toneSolid: Record<Tone, string> = {
	neutral: 'bg-foreground text-background',
	primary: 'bg-primary text-primary-foreground',
	success: 'bg-success text-white',
	warning: 'bg-warning text-white',
	error: 'bg-danger text-white',
	info: 'bg-info text-white'
};

export const toneOutline: Record<Tone, string> = {
	neutral: 'border-border-strong text-foreground',
	primary: 'border-primary/40 text-primary-text',
	success: 'border-success/40 text-success',
	warning: 'border-warning/40 text-warning',
	error: 'border-danger/40 text-danger',
	info: 'border-info/40 text-info'
};

export const toneText: Record<Tone, string> = {
	neutral: 'text-muted-foreground',
	primary: 'text-primary-text',
	success: 'text-success',
	warning: 'text-warning',
	error: 'text-danger',
	info: 'text-info'
};

export const toneDot: Record<Tone, string> = {
	neutral: 'bg-muted-foreground',
	primary: 'bg-primary',
	success: 'bg-success',
	warning: 'bg-warning',
	error: 'bg-danger',
	info: 'bg-info'
};

/** Shape cue that accompanies colour so state is never communicated by colour alone. */
export const toneIcon: Record<Tone, IconName> = {
	neutral: 'circle',
	primary: 'info',
	success: 'check-circle',
	warning: 'alert-triangle',
	error: 'x-circle',
	info: 'info'
};
