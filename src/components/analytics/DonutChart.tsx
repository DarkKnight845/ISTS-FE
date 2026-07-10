import { Box, Typography, useTheme } from '@mui/material';
import type { StatusSegment } from '@/data/mockAnalytics';

interface DonutChartProps {
  data: StatusSegment[];
  title: string;
  subtitle?: string;
  centerLabel?: string;
  centerValue?: string;
}

const LABEL_MAP: Record<string, string> = {
  Active: 'Open',
};

function displayLabel(label: string): string {
  return LABEL_MAP[label] ?? label;
}

function DonutChart({ data, title, subtitle, centerLabel, centerValue }: DonutChartProps) {
  const theme = useTheme();
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = 90;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        p: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexGrow: 1,
          gap: 3,
        }}
      >
        <Box sx={{ position: 'relative', width: '100%', maxWidth: 260, aspectRatio: '1/1', flexShrink: 0 }}>
          <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            {data.map((segment) => {
              const segmentLength = (segment.value / total) * circumference;
              const dashArray = `${segmentLength} ${circumference - segmentLength}`;
              const currentOffset = offset;
              offset += segmentLength;

              return (
                <circle
                  key={segment.label}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '32px' }}>
              {centerValue || total}
            </Typography>
            {centerLabel && (
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                {centerLabel}
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            width: '100%',
          }}
        >
          {data.map((segment) => (
            <Box key={segment.label} sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: segment.color }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '13px' }}>
                  {displayLabel(segment.label)}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                  {segment.value} ({Math.round((segment.value / total) * 100)}%)
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default DonutChart;
