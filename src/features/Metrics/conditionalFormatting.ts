import type { Metric } from '../../types';

export const BAND_COLORS = {
  good: '#B7E2CD',
  medium: '#FDE5CE',
  bad: '#F4CCCD',
};

export const DOT_COLORS = {
  good: '#6DB596',
  medium: '#E7B88E',
  bad: '#D69498',
};

export type Classification = 'good' | 'medium' | 'bad';

export function toNumeric(value: string | number): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (value === '---' || value === '' || value === 'null') return 0;
    if (value.includes(':') && value.split(':').length === 2) {
      const [h, m] = value.split(':').map(Number);
      return (h || 0) + (m || 0) / 60;
    }
    const n = parseFloat(value);
    return Number.isNaN(n) ? 0 : n;
  }
  return 0;
}

export function classifyByRange(
  metric: Metric,
  yValue: number
): Classification {
  const goodVal = toNumeric(metric.good?.value ?? 0);
  const badVal = toNumeric(metric.bad?.value ?? 0);
  const mode = String(metric.good?.mode || '').toLowerCase();
  if (mode === 'more') {
    if (yValue > goodVal) return 'good';
    if (yValue < badVal) return 'bad';
    return 'medium';
  }
  // 'less'
  if (yValue < goodVal) return 'good';
  if (yValue > badVal) return 'bad';
  return 'medium';
}

export function classifyByDelta(
  metric: Metric,
  yValue: number,
  prevY: number | null
): Classification {
  if (prevY === null) return 'medium';
  if (metric.conditionsMode === 'higher') {
    if (yValue > prevY) return 'good';
    if (yValue < prevY) return 'bad';
    return 'medium';
  }
  // lower
  if (yValue < prevY) return 'good';
  if (yValue > prevY) return 'bad';
  return 'medium';
}

export function computeRangeSegments(
  metric: Metric,
  yScale: (y: number) => number,
  innerHeight: number
): Array<{ y: number; height: number; color: string }> {
  if (metric.conditionsMode !== 'range') return [];
  const goodVal = toNumeric(metric.good?.value ?? 0);
  const badVal = toNumeric(metric.bad?.value ?? 0);
  const mode = String(metric.good?.mode || '').toLowerCase();

  const top = 0;
  const bottom = innerHeight;
  const safe = (n: number) => Math.max(0, Math.min(innerHeight, n));

  const yGood = safe(yScale(goodVal));
  const yBad = safe(yScale(badVal));

  const isMore = mode === 'more';
  const segments = isMore
    ? [
        {
          y: top,
          height: Math.max(Math.min(yGood, innerHeight) - top, 0),
          color: BAND_COLORS.good,
        },
        {
          y: Math.min(yGood, yBad),
          height: Math.abs(yBad - yGood),
          color: BAND_COLORS.medium,
        },
        {
          y: Math.min(yBad, bottom),
          height: Math.max(bottom - Math.min(yBad, bottom), 0),
          color: BAND_COLORS.bad,
        },
      ]
    : [
        {
          y: top,
          height: Math.max(Math.min(yBad, innerHeight) - top, 0),
          color: BAND_COLORS.bad,
        },
        {
          y: Math.min(yBad, yGood),
          height: Math.abs(yGood - yBad),
          color: BAND_COLORS.medium,
        },
        {
          y: Math.min(yGood, bottom),
          height: Math.max(bottom - Math.min(yGood, bottom), 0),
          color: BAND_COLORS.good,
        },
      ];

  return segments.filter(s => s.height > 0);
}
