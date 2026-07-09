import { Box, Button, FormControl, InputBase, MenuItem, Select, Typography, useTheme } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  priority: string;
  onPriorityChange: (value: string) => void;
  assignedTo: string;
  onAssignedChange: (value: string) => void;
  assignedOptions?: string[];
  onClear: () => void;
}

const getSelectSx = (theme: any) => ({
  height: '40px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiSelect-select': {
    py: '8px',
    px: '12px',
    fontSize: '14px',
    color: theme.palette.text.primary,
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&:hover .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& .MuiSvgIcon-root': { color: theme.palette.text.secondary },
});

function FilterBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  assignedTo,
  onAssignedChange,
  assignedOptions = [],
  onClear,
}: FilterBarProps) {
  const theme = useTheme();
  const selectSx = getSelectSx(theme);
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        p: '16px',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: { xs: '100%', sm: '320px' },
          height: '40px',
        }}
      >
        <SearchIcon
          sx={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'text.secondary',
            width: 20,
            height: 20,
            pointerEvents: 'none',
          }}
        />
        <InputBase
          placeholder="Search ticket ID, subject, or assignee"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: '100%',
            height: '100%',
            pl: '40px',
            pr: '12px',
            borderRadius: '8px',
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            fontSize: '14px',
            '& input::placeholder': { color: theme.palette.text.disabled, opacity: 1 },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', mb: '4px' }}>
            Status
          </Typography>
          <Select value={status} onChange={(e: SelectChangeEvent) => onStatusChange(e.target.value)} sx={selectSx}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Ongoing">Ongoing</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', mb: '4px' }}>
            Priority
          </Typography>
          <Select value={priority} onChange={(e: SelectChangeEvent) => onPriorityChange(e.target.value)} sx={selectSx}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Urgent">Urgent</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', mb: '4px' }}>
            Assigned to
          </Typography>
          <Select value={assignedTo} onChange={(e: SelectChangeEvent) => onAssignedChange(e.target.value)} sx={selectSx}>
            <MenuItem value="All">All</MenuItem>
            {assignedOptions.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          onClick={onClear}
          sx={{
            height: '40px',
            textTransform: 'none',
            borderRadius: '8px',
            borderColor: theme.palette.divider,
            color: 'text.secondary',
            fontWeight: 500,
            px: '20px',
            alignSelf: 'flex-end',
            '&:hover': { backgroundColor: theme.palette.action.hover, borderColor: theme.palette.divider },
          }}
        >
          Clear filters
        </Button>
      </Box>
    </Box>
  );
}

export default FilterBar;
