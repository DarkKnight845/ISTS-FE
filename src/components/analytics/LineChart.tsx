import { Box, Paper, Typography, useTheme } from '@mui/material';
import { useRef, useState } from 'react';
import type { WeeklyPoint } from '@/data/mockAnalytics';

interface LineChartProps {
  data: WeeklyPoint[];
  title: string;
  subtitle?: string;
}

function LineChart({ data, title, subtitle }: LineChartProps) {
  const theme = useTheme();
  const chartRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    point: WeeklyPoint;
  } | null>(null);
  const width = 600;
  const height = 140;
  const padding = { top: 22, right: 24, bottom: 32, left: 44 };

  const maxValue = Math.max(...data.map((d) => Math.max(d.received, d.resolved)), 1);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xForIndex = (index: number) => padding.left + (index * chartWidth) / (data.length - 1);
  const yForValue = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  const pointsFor = (getter: (d: WeeklyPoint) => number) =>
    data.map((d, i) => ({ x: xForIndex(i), y: yForValue(getter(d)) }));

  // Simple cubic-bezier smoothing through the data points.
  const smoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

    const controlPoint = (current: typeof points[0], previous: typeof points[0], next: typeof points[0], reverse?: boolean) => {
      const p = previous || current;
      const n = next || current;
      const smoothing = 0.2;
      const o = {
        x: n.x - p.x,
        y: n.y - p.y,
      };
      const angle = Math.atan2(o.y, o.x) + (reverse ? Math.PI : 0);
      const length = Math.sqrt(o.x ** 2 + o.y ** 2) * smoothing;
      return {
        x: current.x + Math.cos(angle) * length,
        y: current.y + Math.sin(angle) * length,
      };
    };

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const startCP = controlPoint(points[i - 1], points[i - 2], points[i]);
      const endCP = controlPoint(points[i], points[i - 1], points[i + 1], true);
      d += ` C ${startCP.x} ${startCP.y}, ${endCP.x} ${endCP.y}, ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  const receivedPoints = pointsFor((d) => d.received);
  const resolvedPoints = pointsFor((d) => d.resolved);
  const receivedPath = smoothPath(receivedPoints);
  const resolvedPath = smoothPath(resolvedPoints);

  const areaPath = (path: string, points: { x: number; y: number }[]) => {
    if (points.length === 0) return path;
    const endX = points[points.length - 1].x;
    const startX = points[0].x;
    return `${path} L ${endX} ${padding.top + chartHeight} L ${startX} ${padding.top + chartHeight} Z`;
  };

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        p: '24px',
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '16px', mb: 0.5 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mb: 2 }}>
          {subtitle}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
        <LegendItem color={theme.palette.primary.main} label="Received" />
        <LegendItem color={theme.palette.success.main} label="Resolved" />
      </Box>

      <Box ref={chartRef} sx={{ width: '100%', overflowX: 'auto', position: 'relative' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', minWidth: '360px', display: 'block' }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + chartHeight * (1 - ratio);
            return (
              <g key={ratio}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={theme.palette.divider} strokeWidth={1} />
                <text x={padding.left - 8} y={y + 3} textAnchor="end" fontSize="10" fill={theme.palette.text.secondary}>
                  {Math.round(maxValue * ratio)}
                </text>
              </g>
            );
          })}

          {/* X labels */}
          {data.map((d, i) => (
            <text
              key={d.label}
              x={xForIndex(i)}
              y={height - 10}
              textAnchor="middle"
              fontSize="10"
              fill={theme.palette.text.secondary}
            >
              {d.label}
            </text>
          ))}

          {/* Received area */}
          <path d={areaPath(receivedPath, receivedPoints)} fill={`${theme.palette.primary.main}14`} />
          <path d={receivedPath} fill="none" stroke={theme.palette.primary.main} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Resolved area */}
          <path d={areaPath(resolvedPath, resolvedPoints)} fill={`${theme.palette.success.main}14`} />
          <path d={resolvedPath} fill="none" stroke={theme.palette.success.main} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots and hover targets */}
          {data.map((d, i) => {
            const x = xForIndex(i);
            const yReceived = yForValue(d.received);
            const yResolved = yForValue(d.resolved);
            const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
            const showTooltip = (e: React.MouseEvent) => {
              const rect = chartRef.current?.getBoundingClientRect();
              if (!rect) return;
              const tooltipWidth = 150;
              const tooltipHeight = 70;
              let x = e.clientX - rect.left + 12;
              let y = e.clientY - rect.top - 12;
              // Keep the tooltip inside the chart container so it doesn't overflow
              // and trigger a scrollbar on the right/bottom edges.
              if (x + tooltipWidth > rect.width) {
                x = e.clientX - rect.left - tooltipWidth - 12;
              }
              if (y + tooltipHeight > rect.height) {
                y = rect.height - tooltipHeight - 8;
              }
              setTooltip({
                x: clamp(x, 8, rect.width - tooltipWidth - 8),
                y: clamp(y, 8, rect.height - tooltipHeight - 8),
                point: d,
              });
            };
            const moveTooltip = (e: React.MouseEvent) => {
              const rect = chartRef.current?.getBoundingClientRect();
              if (!rect) return;
              const tooltipWidth = 150;
              const tooltipHeight = 70;
              let x = e.clientX - rect.left + 12;
              let y = e.clientY - rect.top - 12;
              if (x + tooltipWidth > rect.width) {
                x = e.clientX - rect.left - tooltipWidth - 12;
              }
              if (y + tooltipHeight > rect.height) {
                y = rect.height - tooltipHeight - 8;
              }
              setTooltip((prev) =>
                prev
                  ? {
                      x: clamp(x, 8, rect.width - tooltipWidth - 8),
                      y: clamp(y, 8, rect.height - tooltipHeight - 8),
                      point: d,
                    }
                  : null
              );
            };
            return (
              <g key={`dots-${i}`} onMouseEnter={showTooltip} onMouseMove={moveTooltip} onMouseLeave={() => setTooltip(null)}>
                <circle cx={x} cy={yReceived} r={4} fill={theme.palette.background.paper} stroke={theme.palette.primary.main} strokeWidth={2} />
                <circle cx={x} cy={yResolved} r={4} fill={theme.palette.background.paper} stroke={theme.palette.success.main} strokeWidth={2} />
                {/* Larger invisible hit targets */}
                <circle cx={x} cy={yReceived} r={18} fill="transparent" />
                <circle cx={x} cy={yResolved} r={18} fill="transparent" />
              </g>
            );
          })}
        </svg>

        {tooltip && (
          <Paper
            sx={{
              position: 'absolute',
              left: tooltip.x,
              top: tooltip.y,
              zIndex: 10,
              px: 1.25,
              py: 0.75,
              borderRadius: '10px',
              boxShadow: 3,
              pointerEvents: 'none',
              minWidth: 130,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="caption" sx={{ display: 'block', fontWeight: 600, color: 'text.primary', fontSize: '12px', mb: 0.5 }}>
              {tooltip.point.label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                Received: <strong style={{ color: theme.palette.text.primary }}>{tooltip.point.received}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'success.main' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                Resolved: <strong style={{ color: theme.palette.text.primary }}>{tooltip.point.resolved}</strong>
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color }} />
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '13px' }}>
        {label}
      </Typography>
    </Box>
  );
}

export default LineChart;
