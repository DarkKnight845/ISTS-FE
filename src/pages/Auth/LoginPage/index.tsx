import { Box, useTheme } from "@mui/material";
import { istsIcon } from "@/assets/img";
import LoginForm from "./sections/LoginForm";
import ionTicket from '@/assets/icons/ion_ticket.svg'

function LoginPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        width: "100%",
        position: "relative",
        backgroundColor: 'background.default',
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundColor: 'primary.main',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: { xs: '100%', md: "50%" },
          minHeight: { xs: '40vh', md: '100vh' },
        }}
      >
          <Box
            component="img"
            src={ionTicket}
            alt="ISTS ticket"
            sx={{
              width: { xs: 180, sm: 260, md: 320 },
              height: 'auto',
              opacity: isDark ? 0.85 : 1,
            }}
          />
        <Box
          sx={{
            position: "absolute",
            top: { xs: -30, md: -43 },
            left: 16,
          }}
        >
          <Box
            component="img"
            src={istsIcon}
            alt="ISTS Logo"
            sx={{
              height: { xs: 120, md: 160 },
              width: { xs: 120, md: 160 },
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: { xs: '100%', md: "50%" },
          alignSelf: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}

export default LoginPage;
