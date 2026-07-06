import { Box, Button, Typography } from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

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
            color: "#101828",
          }}
        >
          Staff Dashboard
        </Typography>

        <Typography
          sx={{
            color: "#667085",
            mt: 0.5,
          }}
        >
          Manage all your tickets
        </Typography>
      </Box>

      {/* Right Section */}
      <Button
        variant="outlined"
        startIcon={<CalendarTodayOutlinedIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          textTransform: "none",
          borderColor: "#D0D5DD",
          color: "#344054",
          borderRadius: 2,
          px: 2,
          py: 1,
          backgroundColor: "#FFFFFF",
          fontWeight: 500,

          "&:hover": {
            borderColor: "#D0D5DD",
            backgroundColor: "#F9FAFB",
          },
        }}
      >
        1 Apr - 31 Apr 2026
      </Button>
    </Box>
  );
}

export default DashboardHeader;