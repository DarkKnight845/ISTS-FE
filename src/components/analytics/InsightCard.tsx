import { Box, Card, Typography, useTheme } from '@mui/material';
import type { Insight } from '@/data/mockAnalytics';

interface InsightCardProps {
  insight: Insight;
}

function InsightCard({ insight }: InsightCardProps) {
  const theme = useTheme();
  return (
    <Card
      sx={{
        width: '100%',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        boxShadow: 'none',
        p: '24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'default',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2],
        },
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', fontWeight: 500 }}>
        {insight.label}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '28px', lineHeight: 1.2 }}>
          {insight.value}
        </Typography>

        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '12px', display: 'block', mt: '8px' }}
        >
          {insight.change}
        </Typography>
      </Box>
    </Card>
  );
}

export default InsightCard;
