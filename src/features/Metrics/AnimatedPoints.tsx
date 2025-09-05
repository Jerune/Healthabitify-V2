import type { LineCustomSvgLayerProps, LineSeries } from '@nivo/line';

export default function AnimatedPoints<Series extends LineSeries>({
  points,
  currentPoint,
  pointSize,
  pointBorderWidth,
}: LineCustomSvgLayerProps<Series>) {
  return (
    <g>
      {points.map(point => {
        const isActive = currentPoint && currentPoint.id === point.id;
        const scale = isActive ? 1.25 : 1;
        const fill = isActive ? '#ffffff' : point.color;
        const stroke = point.color;
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
