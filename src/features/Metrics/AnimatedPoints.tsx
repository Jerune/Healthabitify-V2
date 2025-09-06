import type { LineCustomSvgLayerProps, LineSeries } from '@nivo/line';

import type { Metric } from '../../types';

import {
  DOT_COLORS,
  classifyByDelta,
  classifyByRange,
  toNumeric,
} from './conditionalFormatting';

export default function AnimatedPoints<Series extends LineSeries>({
  points,
  currentPoint,
  pointSize,
  pointBorderWidth,
  metric,
}: LineCustomSvgLayerProps<Series> & { metric?: Metric }) {
  // Access metric if provided via ResponsiveLine layer closure; fall back to coloring by series color
  return (
    <g>
      {points.map((point, idx, arr) => {
        const isActive = currentPoint && currentPoint.id === point.id;
        const scale = isActive ? 1.25 : 1;

        // Determine classification color
        // Try range first when conditionsMode === 'range'; else delta vs previous point
        let dotColor = point.color;
        const seriesMetric: Metric | undefined = metric;
        const { y, yFormatted } =
          (point.data as {
            y?: number | string;
            yFormatted?: number | string;
          }) || {};
        const yVal = toNumeric(y ?? yFormatted ?? 0);
        let prev: number | null = null;
        if (idx > 0) {
          const prevData =
            (arr[idx - 1].data as {
              y?: number | string;
              yFormatted?: number | string;
            }) || {};
          const prevRaw = prevData.y ?? prevData.yFormatted;
          prev = prevRaw == null ? null : toNumeric(prevRaw);
        }
        if (seriesMetric?.conditionsMode === 'range') {
          const cls = classifyByRange(seriesMetric, yVal);
          dotColor = DOT_COLORS[cls];
        } else if (
          seriesMetric &&
          (seriesMetric.conditionsMode === 'higher' ||
            seriesMetric.conditionsMode === 'lower')
        ) {
          const cls = classifyByDelta(seriesMetric, yVal, prev);
          dotColor = DOT_COLORS[cls];
        }

        const fill = isActive ? '#ffffff' : dotColor;
        const stroke = dotColor;
        const borderW =
          (typeof pointBorderWidth === 'number' ? pointBorderWidth : 0) +
          (isActive ? 1 : 0);

        return (
          <g
            key={point.id}
            transform={`translate(${point.x}, ${point.y}) scale(${scale})`}
            style={{
              transition: 'transform 150ms ease-out',
              pointerEvents: 'none',
            }}
          >
            <circle
              r={pointSize / 2}
              fill={fill}
              stroke={stroke}
              strokeWidth={borderW}
              vectorEffect='non-scaling-stroke'
              style={{
                transition: 'fill 150ms ease-out, stroke-width 150ms ease-out',
              }}
            />
          </g>
        );
      })}
    </g>
  );
}
