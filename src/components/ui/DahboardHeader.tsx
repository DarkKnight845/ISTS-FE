import { Box, Typography } from "@mui/material";
import DateRangeFilter from "@/components/DateRangeFilter";

interface DashboardHeaderProps {
  start?: string;
  end?: string;
  onDateChange?: (start: string, end: string) => void;
}

function DashboardHeader({ start = '', end = '', onDateChange }: DashboardHeaderProps) {
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
      {onDateChange && (
        <DateRangeFilter start={start} end={end} onChange={onDateChange} />
      )}
    </Box>
  );
}

export default DashboardHeader;
