import { CustomButton } from "@/components/ui/Buttons";
import { Box, FormControl, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
function ForgetPasswordForm() {
  return (
    <Box sx={{
      backgroundColor: "#F5F7FA" 
    }}
    

    ><Box
      sx={{
        maxWidth: "519px",
        justifyContent:"center",
        width: "100%",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        backgroundColor: "#FFFFFF",
        padding: { xs: "30px 20px", sm: "40px 40px" },
        mt: { xs: "50px", sm: "100px" },
        borderRadius: "12px",
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          backgroundColor: "#EAF2FF",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LockOutlinedIcon
          sx={{
            fontSize: 36,
            color: "#2559AA",
          }}
        />
      </Box>

      {/* Heading */}
      <Typography
        variant="h5"
        sx={{
          color: "#1B1C1F",
          fontWeight: 600,
          fontFamily: "inherit",
          textAlign: "center",
        }}
      >
        Forgot Password
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          color: "#667085",
          textAlign: "center",
          maxWidth: "380px",
          fontFamily: "inherit",
          mb: 2,
        }}
      >
        Enter your email address and we'll send you a password reset link.
      </Typography>

      {/* Email Field */}
      <FormControl
        sx={{
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <TextField
          name="email"
          placeholder="Email Address"
          fullWidth
          sx={{
            backgroundColor: "#082A4B08",

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

      {/* Button */}
      <CustomButton
        type="submit"
        sx={{
          backgroundColor: "#2559AA",
          color: "#fff",
          borderRadius: "8px",
          fontFamily: "inherit",
          fontSize: { xs: "14px", sm: "18px" },
          fontWeight: 500,
          width: "100%",
          maxWidth: "450px",
          padding: ".8rem",
        }}
      >
        Send Reset Link
      </CustomButton>
    </Box>


    </Box>
  );
}

export default ForgetPasswordForm;