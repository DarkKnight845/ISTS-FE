import { Box, Card, Typography } from '@mui/material';
import { TrendUpIcon, TrendDownIcon } from '@/components/icons';
import type { Insight } from '@/data/mockAnalytics';

interface InsightCardProps {
  insight: Insight;
}

function InsightCard({ insight }: InsightCardProps) {
  const hasTrend = typeof insight.changeUp === 'boolean';
  return (
    <Card
      sx={{
        p: '22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        boxSizing: 'border-box',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', fontWeight: 500 }}>
        {insight.label}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '30px', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
          {insight.value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          {hasTrend && (
            <>
              {insight.changeUp ? (
                <TrendUpIcon size={12} color="success.main" />
              ) : (
                <TrendDownIcon size={12} color="error.main" />
              )}
            </>
          )}
          <Typography
            variant="caption"
            sx={{
              color: hasTrend ? (insight.changeUp ? 'success.main' : 'error.main') : 'text.secondary',
              fontWeight: 600,
              fontSize: '12px',
            }}
          >
            {insight.change}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default InsightCard;
