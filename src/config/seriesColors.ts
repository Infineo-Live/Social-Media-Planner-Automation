/**
 * Deterministic series color mapping for calendar display.
 * Keyed by seriesId. New series automatically receive a fallback palette color.
 * Colors chosen to be visually distinct on the dark (#0f172a) background.
 */

/** HSL-based palette – enough slots for any foreseeable number of series */
const PALETTE: string[] = [
  '#6366f1', // indigo   (accent-primary)
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
  '#a855f7', // purple
];

/** Text colour to pair with each background */
const TEXT = '#ffffff';

export interface SeriesColor {
  bg: string;
  text: string;
}

/**
 * Returns a stable { bg, text } pair for a given seriesId.
 * The same seriesId always maps to the same colour within a session.
 * For IDs 1-5 (the known initial series) the colours are fixed; for new ones
 * we cycle through the remainder of the palette deterministically.
 */
export function getSeriesColor(seriesId: number): SeriesColor {
  const idx = (seriesId - 1) % PALETTE.length;
  return { bg: PALETTE[idx], text: TEXT };
}
