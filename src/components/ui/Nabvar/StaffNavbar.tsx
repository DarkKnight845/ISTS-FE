import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import logo from "@/assets/icons/dash-logo.svg";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

function StaffNavbar() {
  return (
    <Box
      sx={{
        height: 100,
        bgcolor: "#FFFFFF",
        border: "1px solid #EAECF0",
        borderRadius: 3,
        px:5,
        mb: 4,
        mx:-6,

        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Left */}
        <Box
        component="img"
        src={logo}
        alt="Company Logo"
        sx={{
            height: 80,
            width: "auto",
            objectFit: "contain",
        }}
        />
      {/* Right */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Notification */}
        <IconButton>
          <Badge
            badgeContent={3}
            color="error"
          >
            <NotificationsNoneOutlinedIcon />
          </Badge>
        </IconButton>

        {/* User */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
            }}
          >
            E
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Eniafe Bada
            </Typography>

            <Typography
              sx={{
                color: "#667085",
                fontSize: 12,
              }}
            >
              Staff
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default StaffNavbar;