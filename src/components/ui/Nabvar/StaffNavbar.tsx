import {
  Avatar,
  Box,
  Typography,
} from "@mui/material";
import logo from "@/assets/icons/dash-logo.svg";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import NotificationBell from "@/components/NotificationBell";

function StaffNavbar() {
  const { user } = useCurrentUser();

  const initials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '·';

  const displayName = user?.fullName || 'Loading…';
  const roleLabel = user?.roles?.[0] || 'Staff';

  return (
    <Box
      sx={{
        height: 100,
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 5,
        mb: 4,

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
        <NotificationBell icon={<NotificationsNoneOutlinedIcon />} />

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
            {initials}
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {displayName}
            </Typography>

            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 12,
              }}
            >
              {roleLabel}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default StaffNavbar;
