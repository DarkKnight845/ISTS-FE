import { Box, Typography, useTheme } from "@mui/material";
import { useMemo } from "react";
import { istsIcon } from "@/assets/img";
import LoginForm from "./sections/LoginForm";

const QUOTES = [
  "Turning support into a seamless experience.",
  "Every ticket is a step toward a smoother workflow.",
  "Fast, organized, reliable service starts here.",
  "Where complex issues meet simple solutions.",
  "Your toughest problems, resolved with precision.",
  "Empowering teams through smarter support.",
  "Keeping operations running, one ticket at a time.",
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
        minHeight: "100vh",
        width: "100%",
        backgroundColor: 'background.default',
      }}
    >
      {/* Left brand panel */}
      <Box
        sx={{
          flex: { xs: '0 0 auto', md: 1 },
          minHeight: { xs: '34vh', md: '100vh' },
          background: isDark
            ? 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #0B4F9C 0%, #1565C0 55%, #42A5F5 100%)',
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          p: { xs: 3, md: 5 },
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-15%',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            component="img"
            src={istsIcon}
            alt="ISTS Logo"
            sx={{
              height: { xs: 56, md: 72 },
              width: 'auto',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </Box>

        {/* Center value proposition */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '28px', sm: '34px', md: '42px' },
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Support,
            <br />
            Simplified.
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: { xs: '15px', md: '18px' },
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            Streamline tickets, track SLAs, and keep your team productive — all in one place.
          </Typography>
        </Box>

        {/* Quote pill */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-block',
              px: 2.5,
              py: 1.5,
              borderRadius: '999px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.14)',
              maxWidth: { xs: '100%', sm: 420 },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: '#fff',
                fontSize: { xs: '13px', md: '14px' },
                fontWeight: 500,
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              “{quote}”
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: { xs: '1 1 auto', md: 1 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4, md: 6 },
          backgroundColor: 'background.default',
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}

export default LoginPage;
