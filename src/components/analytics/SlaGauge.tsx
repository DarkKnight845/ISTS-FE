import { Box, Typography, useTheme } from '@mui/material';

interface SlaGaugeProps {
  value: number;
  title: string;
  subtitle?: string;
  caption?: string;
}

function SlaGauge({ value, title, subtitle, caption }: SlaGaugeProps) {
  const theme = useTheme();
  const radius = 70;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${(value / 100) * circumference} ${circumference}`;

  const getColor = (v: number) => {
    if (v >= 90) return '#16A34A';
    if (v >= 75) return '#F59E0B';
    return '#DC2626';
  };

  const color = getColor(value);

  const defaultCaption =
    value >= 90
      ? 'Great job! SLA targets are being met.'
      : value >= 75
      ? 'Fair. Some tickets need attention.'
      : 'Attention needed. Several tickets breached SLA.';

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: 'background.paper',
        p: '24px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '16px', mb: 0.5, textAlign: 'left' }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mb: 2, textAlign: 'left' }}>
          {subtitle}
        </Typography>
      )}

      <Box sx={{ position: 'relative', width: 180, height: 180, mx: 'auto', my: 2 }}>
        <svg viewBox="0 0 180 180" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={theme.palette.action.hover}
            strokeWidth={strokeWidth}
          />
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeLinecap="round"
          />
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
          <Typography variant="h4" sx={{ fontWeight: 600, color, fontSize: '36px' }}>
            {value}%
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
            Compliance
          </Typography>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
        {caption ?? defaultCaption}
      </Typography>
    </Box>
  );
}

export default SlaGauge;
