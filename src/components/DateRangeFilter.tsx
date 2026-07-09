import { useState } from 'react';
import { Box, Button, Popover, Typography, useTheme } from '@mui/material';
import { CalendarIcon } from '@/components/icons';

interface DateRangeFilterProps {
  start?: string;
  end?: string;
  onChange: (start: string, end: string) => void;
}

function formatLabel(start?: string, end?: string) {
  if (!start && !end) return 'All time';
  if (start && !end) return `From ${formatDate(start)}`;
  if (!start && end) return `Until ${formatDate(end)}`;
  return `${formatDate(start!)} - ${formatDate(end!)}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function DateRangeFilter({ start = '', end = '', onChange }: DateRangeFilterProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [draftStart, setDraftStart] = useState(start);
  const [draftEnd, setDraftEnd] = useState(end);

  const open = Boolean(anchorEl);

  const handleApply = () => {
    onChange(draftStart, draftEnd);
    setAnchorEl(null);
  };

  const handleReset = () => {
    setDraftStart('');
    setDraftEnd('');
    onChange('', '');
    setAnchorEl(null);
  };

  const inputStyle: React.CSSProperties = {
    height: 40,
    padding: '0 12px',
    borderRadius: 8,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    fontFamily: 'inherit',
    fontSize: 14,
  };

  return (
    <>
      <Box
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 1,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '10px',
          backgroundColor: 'background.paper',
          color: 'text.secondary',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        <CalendarIcon size={16} color="currentColor" />
        <Typography variant="body2" sx={{ fontSize: 14 }}>
          {formatLabel(start, end)}
        </Typography>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              p: 2,
              borderRadius: '12px',
              backgroundColor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`,
              minWidth: 320,
            },
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Filter by date
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>From</Typography>
              <input
                type="date"
                value={draftStart}
                onChange={(e) => setDraftStart(e.target.value)}
                style={inputStyle}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 120 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>To</Typography>
              <input
                type="date"
                value={draftEnd}
                onChange={(e) => setDraftEnd(e.target.value)}
                style={inputStyle}
              />
            </label>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              sx={{ textTransform: 'none', borderColor: 'divider', color: 'text.secondary' }}
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={handleApply}
              sx={{ textTransform: 'none' }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

export default DateRangeFilter;
