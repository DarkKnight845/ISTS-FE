import { Avatar, Box, Typography, useTheme } from '@mui/material';
import type { AgentLoad } from '@/data/mockAnalytics';

interface BarChartProps {
  data: AgentLoad[];
  title: string;
  subtitle?: string;
}

function BarChart({ data, title, subtitle }: BarChartProps) {
  const theme = useTheme();
  const maxTotal = Math.max(...data.map((d) => d.open + d.resolved), 1);

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

      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <LegendItem color={theme.palette.primary.main} label="Open" />
        <LegendItem color={theme.palette.success.light} label="Resolved" />
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {data.map((agent) => {
          const total = agent.open + agent.resolved;
          const openWidth = (agent.open / maxTotal) * 100;
          const resolvedWidth = (agent.resolved / maxTotal) * 100;

          return (
            <Box key={agent.name} sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  fontSize: '12px',
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {agent.initials}
              </Avatar>

              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '6px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '13px' }}>
                    {agent.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
                    {total} tickets
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', height: '10px', borderRadius: '999px', overflow: 'hidden', backgroundColor: theme.palette.action.hover }}>
                  <Box sx={{ width: `${openWidth}%`, backgroundColor: theme.palette.primary.main }} />
                  <Box sx={{ width: `${resolvedWidth}%`, backgroundColor: theme.palette.success.light }} />
                </Box>
              </Box>
            </Box>
          );
        })}
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

export default BarChart;
