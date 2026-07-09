import { Box, Card, Typography } from '@mui/material';
import { TrendUpIcon, TrendDownIcon } from '@/components/icons';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  /** True when the trend is positive/upward. */
  trendUp?: boolean;
  icon: React.ReactNode;
  iconBg: string;
}

/**
 * KPI stat card matching the dashboard design.
 */
function StatCard({ title, value, trend, trendUp = true, icon, iconBg }: StatCardProps) {
  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '16px',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        p: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'background.paper',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6 }}>
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, fontSize: '14px' }}>
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
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '32px', lineHeight: 1.2 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          {trendUp ? <TrendUpIcon size={12} color="success.main" /> : <TrendDownIcon size={12} color="error.main" />}
          <Typography
            variant="caption"
            sx={{ color: trendUp ? 'success.main' : 'error.main', fontWeight: 500, fontSize: '12px' }}
          >
            {trend}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default StatCard;
