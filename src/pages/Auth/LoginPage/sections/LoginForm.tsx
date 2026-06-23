import { CustomButton } from "@/components/ui/Buttons";
import { Box, FormControl, Link, TextField, Typography } from "@mui/material";

function LoginForm() {
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
      <Typography variant="h5" sx={{ mb:3, color:"#1B1C1F",fontWeight:600}}>Log in to your account.</Typography>
      <form onSubmit={() => {}} style={{ width: "100%",}}>
        <FormControl sx={{ mb: 4, width: "450px" }}>
          <TextField
            name="email"
            placeholder="Email"
            fullWidth
            // value={formData.emailOrHRTag}
            // onChange={handleInputChange}
            // error={Boolean(errors.emailOrHRTag)}
            // helperText={errors.emailOrHRTag}
            sx={{
              fontFamily: "Poppins",
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

        {/* Password */}
        <FormControl sx={{ mb: 6, width: "450px" }}>
          <TextField
            name="password"
            // type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            fullWidth
            sx={{
              borderRadius: "12px",
              color: "#082A4B99",
              border: "none",
              fontFamily: "Poppins",
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
            // value={formData.password}
            // onChange={handleInputChange}
            // error={Boolean(errors.password)}
            // helperText={errors.password}
            // // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       <IconButton
            //         onClick={togglePasswordVisibility}
            //         aria-label="toggle password visibility"
            //         edge="end"
            //       >
            //         {showPassword ? <Visibility /> : <VisibilityOff />}
            //       </IconButton>
            //     </InputAdornment>
            //   ),
            // }}
          />

          <Link
            // href="#"
            underline="none"
            sx={{
              color: "#2559AA",
              fontFamily: "Poppins",
              fontSize: {
                xs: "10px",
                sm: "12px",
              },
              fontWeight: 600,
              textDecorationStyle: "solid",
              cursor: "pointer",
              mt: "12px",
                alignSelf:'self-end'
            }}
          >
            Forgot Password?
          </Link>
        </FormControl>

        {/* Submit Button */}
        <CustomButton
          loadingPosition="end"
          type="submit"
          sx={{
            backgroundColor: "#2559AA",
            color: "#fff",
            borderRadius: "8px",
            fontFamily: "Poppins",
            fontSize: { xs: "13px", sm: "20px" },
            fontWeight: 600,
            width: "450px",
            padding: "3px",
          }}
        >
          log in
        </CustomButton>
      </form>
    </Box>
  );
}

export default LoginForm;
