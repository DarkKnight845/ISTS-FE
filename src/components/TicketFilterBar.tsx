import { Box, Button, InputBase, Paper, useTheme } from '@mui/material';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

interface TicketFilterBarProps<T extends string> {
  /** Tab labels (and values) in display order. */
  tabs: readonly T[];
  activeTab: T;
  onChange: (tab: T) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  /** When true, the embedded search field is hidden. Useful when the parent
   *  renders the search input elsewhere in the layout. */
  hideSearch?: boolean;
  /** Optional date filter rendered next to the search input. */
  dateFilter?: React.ReactNode;
}

/**
 * Filter tabs + search bar for the ticket table. Generic over the tab type
 * so each dashboard can supply its own (e.g. Mine/Unassigned for agents,
 * Open/Waiting/Resolved for staff).
 */
function TicketFilterBar<T extends string>({
  tabs,
  activeTab,
  onChange,
  search = '',
  onSearchChange,
  hideSearch = false,
  dateFilter,
}: TicketFilterBarProps<T>) {
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
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],
          borderRadius: '10px',
          p: 0.5,
          border: '1px solid',
          borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300],
        }}
      >
        {tabs.map((tab) => (
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

      {!hideSearch && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {dateFilter}
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
      )}
    </Box>
  );
}

export default TicketFilterBar;