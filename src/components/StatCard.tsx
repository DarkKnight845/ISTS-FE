import { Box, Card, Typography } from '@mui/material';
import { TrendUpIcon, TrendDownIcon } from '@/components/icons';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  trendUp?: boolean;
  icon: React.ReactNode;
  iconBg: string;
  valueColor?: string;
}

/**
 * KPI stat card for the modern enterprise dashboard.
 */
function StatCard({ title, value, trend, trendUp, icon, iconBg, valueColor }: StatCardProps) {
  const hasTrend = typeof trendUp === 'boolean';
  return (
    <Card
      sx={{
        width: '100%',
        p: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'background.paper',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '13px' }}>
          {title}
        </Typography>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
      </Box>

      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: valueColor || 'text.primary',
            fontSize: '30px',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          {hasTrend && (
            <>
              {trendUp ? (
                <TrendUpIcon size={12} color="success.main" />
              ) : (
                <TrendDownIcon size={12} color="error.main" />
              )}
            </>
          )}
          <Typography
            variant="caption"
            sx={{
              color: hasTrend ? (trendUp ? 'success.main' : 'error.main') : 'text.secondary',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {trend}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default StatCard;
