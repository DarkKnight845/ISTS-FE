import { useState } from 'react';
import { Box, Button, InputBase, Paper, useTheme } from '@mui/material';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 5H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 19H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="5" r="2" fill="currentColor" />
    <circle cx="15" cy="12" r="2" fill="currentColor" />
    <circle cx="9" cy="19" r="2" fill="currentColor" />
  </svg>
);

type FilterTab = 'All' | 'Mine' | 'Unassigned';

interface TicketFilterBarProps {
  activeTab: FilterTab;
  onChange: (tab: FilterTab) => void;
}

/**
 * Filter tabs, search, and filter icon for the ticket table.
 */
function TicketFilterBar({ activeTab, onChange }: TicketFilterBarProps) {
  const [search, setSearch] = useState('');
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100], borderRadius: '10px', p: 0.5 }}>
        {(['All', 'Mine', 'Unassigned'] as FilterTab[]).map((tab) => (
          <Button
            key={tab}
            onClick={() => onChange(tab)}
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: '6px',
              textTransform: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: activeTab === tab ? 'text.primary' : 'text.secondary',
              backgroundColor: activeTab === tab ? 'background.paper' : 'transparent',
              boxShadow: activeTab === tab ? theme.shadows[1] : 'none',
              '&:hover': { backgroundColor: activeTab === tab ? 'background.paper' : theme.palette.action.hover },
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Paper
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            py: 0.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '10px',
            boxShadow: 'none',
            bgcolor: 'background.paper',
            minWidth: 240,
          }}
        >
          <SearchIcon />
          <InputBase
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ml: 1, fontSize: 14, flex: 1 }}
          />
        </Paper>

        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            borderColor: theme.palette.divider,
            borderRadius: '10px',
            fontSize: 13,
            fontWeight: 500,
            '&:hover': { borderColor: theme.palette.divider, backgroundColor: theme.palette.action.hover },
          }}
        >
          Filter
        </Button>
      </Box>
    </Box>
  );
}

export default TicketFilterBar;
