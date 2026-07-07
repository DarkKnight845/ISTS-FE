import { Box, Card, Typography, useTheme } from '@mui/material';
import { TrendUpIcon, TrendDownIcon } from '@/components/icons';
import type { Insight } from '@/data/mockAnalytics';

interface InsightCardProps {
  insight: Insight;
}

function InsightCard({ insight }: InsightCardProps) {
  const theme = useTheme();
  const changeColor = insight.changeUp ? theme.palette.success.main : theme.palette.error.main;
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
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', fontWeight: 500 }}>
        {insight.label}
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '28px', lineHeight: 1.2 }}>
          {insight.value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mt: '8px' }}>
          <Box sx={{ color: changeColor }}>
            {insight.changeUp ? <TrendUpIcon size={12} /> : <TrendDownIcon size={12} />}
          </Box>
          <Typography variant="caption" sx={{ color: changeColor, fontWeight: 500, fontSize: '12px' }}>
            {insight.change}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}

export default InsightCard;
