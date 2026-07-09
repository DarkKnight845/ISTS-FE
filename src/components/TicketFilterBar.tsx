import { Box, Button, InputBase, Paper, useTheme } from '@mui/material';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);


type FilterTab = 'All' | 'Mine' | 'Unassigned';

interface TicketFilterBarProps {
  activeTab: FilterTab;
  onChange: (tab: FilterTab) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
}

/**
 * Filter tabs, search, and filter icon for the ticket table.
 */
function TicketFilterBar({
  activeTab,
  onChange,
  search = '',
  onSearchChange,
}: TicketFilterBarProps) {
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
            onChange={(e) => onSearchChange?.(e.target.value)}
            sx={{ ml: 1, fontSize: 14, flex: 1 }}
          />
        </Paper>

      </Box>
    </Box>
  );
}

export default TicketFilterBar;
