import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { istsIcon } from "@/assets/img";
import LoginForm from "./sections/LoginForm";
import ionTicket from '@/assets/icons/ion_ticket.svg'

const QUOTES = [
  "ISTS — turning IT support into a seamless experience.",
  "Every ticket is a step toward a smoother workflow.",
  "Fast, organized, reliable IT service starts here.",
  "Where complex issues meet simple solutions.",
  "Your technology problems, resolved with precision.",
  "Empowering teams through smarter support.",
  "ISTS keeps the digital engine running.",
];

function LoginPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

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

        <Box
          sx={{
            position: 'absolute',
            bottom: { xs: 3, md: 4 },
            left: { xs: 3, md: 4 },
            maxWidth: { xs: '85%', md: '70%' },
            p: { xs: 2, md: 3 },
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: { xs: '13px', md: '15px' },
              fontWeight: 500,
              lineHeight: 1.5,
              fontStyle: 'italic',
            }}
          >
            “{quote}”
          </Typography>
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
