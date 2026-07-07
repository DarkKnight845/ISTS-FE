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
        maxWidth: "519px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#FFFFFF",
        padding: { xs: "30px 20px" },
        mt: { xs: "-50px", sm: "-30px" },
      }}
    >
      <Typography variant="h5" sx={{ mb: 3, color: "#1B1C1F", fontWeight: 600, fontFamily: "inherit" }}>
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
              backgroundColor: "#082A4B08",
              border: "none",

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",

                "& fieldset": {
                  border: "none",
                },

                "&:hover fieldset": {
                  border: "none",
                },

                "&.Mui-focused fieldset": {
                  border: "none",
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
              color: "#082A4B99",
              border: "none",
              fontFamily: "inherit",
              backgroundColor: "#082A4B08",
              fontSize: "16px",
              fontWeight: "400",

              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",

                "& fieldset": {
                  border: "none",
                },

                "&:hover fieldset": {
                  border: "none",
                },

                "&.Mui-focused fieldset": {
                  border: "none",
                },
              },
            }}
          />

          <Link
            href="/forgot-password"
            underline="hover"
            sx={{
              color: "#2559AA",
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
              color: "#DC2626",
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
            backgroundColor: "#2559AA",
            color: "#fff",
            borderRadius: "8px",
            fontFamily: "inherit",
            fontSize: { xs: "13px", sm: "20px" },
            fontWeight: 500,
            width: "450px",
            padding: ".6rem",
          }}
        >
          Log in
        </CustomButton>
      </form>
    </Box>
  );
}

export default LoginForm;
