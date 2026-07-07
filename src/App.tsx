import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import AppRoutes from "./routes/Routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useThemeMode } from "./context/ThemeContext";
import { getTheme } from "./theme";

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = getTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
