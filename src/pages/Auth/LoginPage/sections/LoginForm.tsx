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
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        backgroundColor: 'background.paper',
        p: { xs: 3, sm: 5 },
        borderRadius: '20px',
        boxShadow: { xs: 'none', sm: 3 },
        border: { xs: 'none', sm: '1px solid' },
        borderColor: 'divider',
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            fontSize: { xs: '26px', sm: '30px' },
            mb: 1,
          }}
        >
          Welcome back
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '15px',
            lineHeight: 1.5,
          }}
        >
          Enter your credentials to access your dashboard.
        </Typography>
      </Box>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 0.75,
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              Email address
            </Typography>
            <TextField
              name="email"
              type="email"
              placeholder="you@company.com"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'background.default',
                  fontSize: '15px',
                  color: 'text.primary',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '1.5px',
                  },
                },
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 0.75,
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              Password
            </Typography>
            <TextField
              name="password"
              type="password"
              placeholder="••••••••"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: 'background.default',
                  fontSize: '15px',
                  color: 'text.primary',
                  '& fieldset': {
                    borderColor: 'divider',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '1.5px',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Link
                href="/forgot-password"
                underline="hover"
                sx={{
                  color: 'primary.main',
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Link>
            </Box>
          </FormControl>

          {error && (
            <Typography
              variant="body2"
              sx={{
                color: 'error.main',
                fontSize: '13px',
                textAlign: 'center',
                py: 1,
                px: 1.5,
                borderRadius: '8px',
                backgroundColor: 'error.light',
              }}
            >
              {error}
            </Typography>
          )}

          <CustomButton
            loadingPosition="end"
            type="submit"
            loading={loading}
            fullWidth
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              py: 1.25,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            Log in
          </CustomButton>
        </Box>
      </form>
    </Box>
  );
}

export default LoginForm;
