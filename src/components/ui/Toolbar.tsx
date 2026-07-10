import {
  Box,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

type StaffToolbarProps = {
  activeFilter: StaffFilter;
  onFilterChange: (filter: StaffFilter) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onRaiseTicket: () => void;
};

export type StaffFilter = "All" | "Open" | "Waiting" | "Resolved";

const FILTERS: StaffFilter[] = ["All", "Open", "Waiting", "Resolved"];

function StaffToolbar({
  activeFilter,
  onFilterChange,
  search,
  onSearchChange,
  onRaiseTicket,
}: StaffToolbarProps) {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Left Section */}
      <ButtonGroup
        variant="text"
        sx={{
          bgcolor: theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[100],
          borderRadius: "10px",
          overflow: "hidden",

          "& .MuiButton-root": {
            textTransform: "none",
            color: "text.secondary",
            fontWeight: 500,
            px: 3,
            py: 1.2,
            border: "none",
          },
        }}
      >
        {FILTERS.map((filter) => {
          const selected = activeFilter === filter;
          return (
            <Button
              key={filter}
              onClick={() => onFilterChange(filter)}
              sx={{
                bgcolor: selected ? "background.paper" : "transparent",
                color: selected ? "text.primary" : "text.secondary",
                fontWeight: selected ? 600 : 500,
                boxShadow: selected ? theme.shadows[1] : "none",
                "&:hover": {
                  bgcolor: selected ? "background.paper" : theme.palette.action.hover,
                },
              }}
            >
              {filter}
            </Button>
          );
        })}
      </ButtonGroup>

      {/* Right Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search tickets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{
            width: 260,

            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "background.paper",
              height: 42,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.disabled" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Raise Ticket */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onRaiseTicket}
          sx={{
            bgcolor: "primary.main",
            textTransform: "none",
            px: 3,
            height: 42,
            borderRadius: 2,
            boxShadow: "none",

            "&:hover": {
              bgcolor: "primary.dark",
              boxShadow: "none",
            },
          }}
        >
          Raise a Ticket
        </Button>
      </Box>
    </Box>
  );
}

export default StaffToolbar;
