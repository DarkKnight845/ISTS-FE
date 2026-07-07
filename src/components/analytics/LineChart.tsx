import { Box, Typography, useTheme } from '@mui/material';
import type { WeeklyPoint } from '@/data/mockAnalytics';

interface LineChartProps {
  data: WeeklyPoint[];
  title: string;
  subtitle?: string;
}

function LineChart({ data, title, subtitle }: LineChartProps) {
  const theme = useTheme();
  const width = 600;
  const height = 220;
  const padding = { top: 30, right: 24, bottom: 40, left: 44 };

  const maxValue = Math.max(...data.map((d) => Math.max(d.received, d.resolved)), 1);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xForIndex = (index: number) => padding.left + (index * chartWidth) / (data.length - 1);
  const yForValue = (value: number) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  const receivedPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i)} ${yForValue(d.received)}`)
    .join(' ');

  const resolvedPath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i)} ${yForValue(d.resolved)}`)
    .join(' ');

  const areaPath = (path: string, values: number[]) => {
    const endX = xForIndex(values.length - 1);
    const startX = xForIndex(0);
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

      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: '100%', height: 'auto', minWidth: '360px' }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + chartHeight * (1 - ratio);
            return (
              <g key={ratio}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke={theme.palette.divider} strokeWidth={1} />
                <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill={theme.palette.text.secondary}>
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
              y={height - 12}
              textAnchor="middle"
              fontSize="12"
              fill={theme.palette.text.secondary}
            >
              {d.label}
            </text>
          ))}

          {/* Received area */}
          <path d={areaPath(receivedPath, data.map((d) => d.received))} fill={`${theme.palette.primary.main}14`} />
          <path d={receivedPath} fill="none" stroke={theme.palette.primary.main} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Resolved area */}
          <path d={areaPath(resolvedPath, data.map((d) => d.resolved))} fill={`${theme.palette.success.main}14`} />
          <path d={resolvedPath} fill="none" stroke={theme.palette.success.main} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

          {/* Dots */}
          {data.map((d, i) => (
            <g key={`dots-${i}`}>
              <circle cx={xForIndex(i)} cy={yForValue(d.received)} r={4} fill={theme.palette.background.paper} stroke={theme.palette.primary.main} strokeWidth={2} />
              <circle cx={xForIndex(i)} cy={yForValue(d.resolved)} r={4} fill={theme.palette.background.paper} stroke={theme.palette.success.main} strokeWidth={2} />
            </g>
          ))}
        </svg>
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
