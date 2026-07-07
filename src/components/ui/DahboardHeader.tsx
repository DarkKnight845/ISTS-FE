import { Box, Button, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CalendarIcon } from "@/components/icons";

function DashboardHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
       
      }}
    >
      {/* Left Section */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          Staff Dashboard
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mt: 0.5,
          }}
        >
          Manage all your tickets
        </Typography>
      </Box>

      {/* Right Section */}
      <Button
        variant="outlined"
        startIcon={<CalendarIcon size={18} color="currentColor" />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          textTransform: "none",
          borderColor: "divider",
          color: "text.secondary",
          borderRadius: 2,
          px: 2,
          py: 1,
          backgroundColor: "background.paper",
          fontWeight: 500,

          "&:hover": {
            borderColor: "divider",
            backgroundColor: "action.hover",
          },
        }}
      >
        1 Apr - 31 Apr 2026
      </Button>
    </Box>
  );
}

export default DashboardHeader;