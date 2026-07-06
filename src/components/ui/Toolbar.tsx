import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import AddIcon from "@mui/icons-material/Add";

type StaffToolbarProps = {
  onRaiseTicket: () => void;
};

function StaffToolbar({ onRaiseTicket }: StaffToolbarProps) {
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
          bgcolor: "#F8F9FB",
          borderRadius: "10px",
          overflow: "hidden",

          "& .MuiButton-root": {
            textTransform: "none",
            color: "#344054",
            fontWeight: 500,
            px: 3,
            py: 1.2,
            border: "none",
          },
        }}
      >
        <Button
          sx={{
            bgcolor: "#FFFFFF",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#FFFFFF",
            },
          }}
        >
          All
        </Button>

        <Button>Ongoing</Button>

        <Button>Waiting</Button>

        <Button>Completed</Button>
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
          sx={{
            width: 260,

            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#FFFFFF",
              height: 42,
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#98A2B3" }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Filter */}
        <IconButton
          sx={{
            width: 42,
            height: 42,
            border: "1px solid #D0D5DD",
            borderRadius: 2,
          }}
        >
          <TuneIcon />
        </IconButton>

        {/* Raise Ticket */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onRaiseTicket}
          sx={{
            bgcolor: "#2859B8",
            textTransform: "none",
            px: 3,
            height: 42,
            borderRadius: 2,
            boxShadow: "none",

            "&:hover": {
              bgcolor: "#214A99",
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