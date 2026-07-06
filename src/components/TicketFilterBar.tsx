import { useState } from 'react';
import { Box, Button, InputBase, Paper } from '@mui/material';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="#6B7280" strokeWidth="1.5" fill="none" />
    <path d="M21 21L16.65 16.65" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 5H20" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 12H20" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4 19H20" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="9" cy="5" r="2" fill="#6B7280" />
    <circle cx="15" cy="12" r="2" fill="#6B7280" />
    <circle cx="9" cy="19" r="2" fill="#6B7280" />
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
      <Box sx={{ display: 'flex', gap: 1, backgroundColor: '#F3F4F6', borderRadius: '10px', p: 0.5 }}>
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
              color: activeTab === tab ? '#111827' : '#6B7280',
              backgroundColor: activeTab === tab ? '#fff' : 'transparent',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              '&:hover': { backgroundColor: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.6)' },
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
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            boxShadow: 'none',
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
            color: '#374151',
            borderColor: '#E5E7EB',
            borderRadius: '10px',
            fontSize: 13,
            fontWeight: 500,
            '&:hover': { borderColor: '#D1D5DB', backgroundColor: '#F9FAFB' },
          }}
        >
          Filter
        </Button>
      </Box>
    </Box>
  );
}

export default TicketFilterBar;
