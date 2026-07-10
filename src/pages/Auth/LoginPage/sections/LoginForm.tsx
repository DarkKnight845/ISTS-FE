import { CustomButton } from "@/components/ui/Buttons";
import { useAuth, getDashboardPath } from "@/context/AuthContext";
import { loginRequest } from "@/lib/api";
import { getRoleFromJwt } from "@/lib/jwt";
import {
  Box,
  FormControl,
  Link,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await loginRequest(email, password);
      login(result.accessToken);
      const role = getRoleFromJwt(result.accessToken);
      if (role) {
        navigate(getDashboardPath(role), { replace: true });
      } else {
        setError("Could not determine user role from token.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "519px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: 'background.paper',
        padding: { xs: "30px 20px" },
        mt: { xs: "-50px", sm: "-30px" },
        borderRadius: { xs: '24px 24px 0 0', md: 0 },
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary', fontWeight: 600, fontFamily: "inherit" }}>
        Log in to your account.
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <FormControl sx={{ mb: 4, width: "450px" }}>
          <TextField
            name="email"
            placeholder="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              fontFamily: "inherit",
              fontSize: {
                xs: "12px",
                sm: "12px",
                md: "14px",
                lg: "16px",
              },
              fontWeight: "400",
              borderRadius: "8px",
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(8, 42, 75, 0.03)',
              border: "none",
              color: 'text.primary',

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                color: 'text.primary',

                "& fieldset": {
                  border: "none",
                },

                "&:hover fieldset": {
                  border: "none",
                },

                "&.Mui-focused fieldset": {
                  border: "none",
                },

                "& input::placeholder": {
                  color: 'text.secondary',
                  opacity: 0.7,
                },
              },
            }}
          />
        </FormControl>

        <FormControl sx={{ mb: 4, width: "450px" }}>
          <TextField
            name="password"
            type="password"
            placeholder="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              borderRadius: "12px",
              color: 'text.secondary',
              border: "none",
              fontFamily: "inherit",
              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(8, 42, 75, 0.03)',
              fontSize: "16px",
              fontWeight: "400",

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                color: 'text.primary',

                "& fieldset": {
                  border: "none",
                },

                "&:hover fieldset": {
                  border: "none",
                },

                "&.Mui-focused fieldset": {
                  border: "none",
                },

                "& input::placeholder": {
                  color: 'text.secondary',
                  opacity: 0.7,
                },
              },
            }}
          />

          <Link
            href="/forgot-password"
            underline="hover"
            sx={{
              color: 'primary.main',
              fontFamily: "inherit",
              fontSize: {
                xs: "10px",
                sm: "12px",
              },
              fontWeight: 500,
              textDecorationStyle: "solid",
              cursor: "pointer",
              mt: "12px",
              alignSelf: "self-end",
            }}
          >
            Forgot Password?
          </Link>
        </FormControl>

        {error && (
          <Typography
            variant="body2"
            sx={{
              color: 'error.main',
              fontSize: "13px",
              mb: 3,
              textAlign: "center",
              width: "450px",
            }}
          >
            {error}
          </Typography>
        )}

        <CustomButton
          loadingPosition="end"
          type="submit"
          loading={loading}
          sx={{
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: { xs: "13px", sm: "20px" },
            fontWeight: 500,
            width: "450px",
            padding: ".6rem",
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Log in
        </CustomButton>
      </form>
    </Box>
  );
}

export default LoginForm;
