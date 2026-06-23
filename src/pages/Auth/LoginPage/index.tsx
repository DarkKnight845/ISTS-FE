import { Box } from "@mui/material";
import { istsIcon } from "@/assets/img";
import LoginForm from "./sections/LoginForm";
import ionTicket from '@/assets/icons/ion_ticket.svg'

function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "100vh",
        width: "100%",
        position: "relative",
        // alignContent: 'flex-start',
      }}
    >
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#2559AA",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          width: "50%",
        }}
      >
          <Box component='img' src={ionTicket}></Box>
        <Box
          sx={{
            position: "absolute",
            top: -43,
            left: 16,
          }}
        >
          <Box
            component="img"
            src={istsIcon}
            alt="HCMS Logo"
            sx={{
              height: "160px",
              width: "160px",
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          width: "50%",
          alignSelf:'center'
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}

export default LoginPage;
