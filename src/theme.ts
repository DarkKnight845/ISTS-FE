import { createTheme } from '@mui/material';

export type ThemeMode = 'light' | 'dark';

// Modern enterprise palette.
const navSlate = '#0F172A';
const navSlateHover = '#1E293B';
const brandPrimary = '#2563EB';
const brandPrimaryDark = '#1D4ED8';

// Status surface system.
export const statusColors = {
  open: { bg: '#DBEAFE', text: '#1D4ED8' },
  ongoing: { bg: '#FEF3C7', text: '#D97706' },
  resolved: { bg: '#D1FAE5', text: '#059669' },
  closed: { bg: '#E5E7EB', text: '#374151' },
  urgent: { bg: '#FEE2E2', text: '#DC2626' },
  high: { bg: '#FEF3C7', text: '#B45309' },
  medium: { bg: '#ECFDF5', text: '#047857' },
  low: { bg: '#F3F4F6', text: '#374151' },
} as const;

export function getTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: brandPrimary,
        dark: brandPrimaryDark,
        contrastText: '#fff',
        light: '#60A5FA',
      },
      background: {
        default: isDark ? '#0B1120' : '#F4F6F8',
        paper: isDark ? '#111827' : '#fff',
      },
      text: {
        primary: isDark ? '#F8FAFC' : '#0F172A',
        secondary: isDark ? '#94A3B8' : '#64748B',
        disabled: isDark ? '#475569' : '#94A3B8',
      },
      divider: isDark ? '#1E293B' : '#E2E8F0',
      success: {
        main: '#059669',
        light: '#D1FAE5',
        dark: '#047857',
      },
      warning: {
        main: '#D97706',
        light: '#FEF3C7',
        dark: '#B45309',
      },
      error: {
        main: '#DC2626',
        light: '#FEE2E2',
        dark: '#991B1B',
      },
      nav: {
        main: navSlate,
        dark: navSlateHover,
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: '"General Sans", "Inter", sans-serif',
      h4: { fontWeight: 700, letterSpacing: '-0.02em' },
      h5: { fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600 },
      body2: { fontWeight: 500 },
      caption: { fontWeight: 500 },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
      '0 1px 3px 0 rgba(15, 23, 42, 0.07), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
      '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
      '0 10px 15px -3px rgba(15, 23, 42, 0.07), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      ...Array.from({ length: 19 }, () => '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)'),
    ] as any,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: '"General Sans", "Inter", sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': { boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '16px',
            border: '1px solid',
            borderColor: isDark ? '#1E293B' : '#E2E8F0',
            boxShadow: 'none',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: '10px',
          },
        },
      },
    },
  });
}
