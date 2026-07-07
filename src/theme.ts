import { createTheme } from '@mui/material';

export type ThemeMode = 'light' | 'dark';

const brandPrimary = '#2559AA';
const brandPrimaryDark = '#1e4890';

export function getTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brandPrimary,
        dark: brandPrimaryDark,
        contrastText: '#fff',
      },
      background: {
        default: isDark ? '#0F172A' : '#F8F9FB',
        paper: isDark ? '#1E293B' : '#fff',
      },
      text: {
        primary: isDark ? '#F1F5F9' : '#111827',
        secondary: isDark ? '#94A3B8' : '#6B7280',
      },
      divider: isDark ? '#334155' : '#E5E7EB',
    },
    typography: {
      fontFamily: '"General Sans", sans-serif',
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"General Sans", sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  });
}
