import { IconButton, Tooltip } from '@mui/material';
import { useThemeMode } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@/components/icons';

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleMode}
        sx={{
          color: 'text.secondary',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '10px',
          width: 40,
          height: 40,
          '&:hover': {
            color: 'primary.main',
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        {isDark ? <SunIcon size={20} color="currentColor" /> : <MoonIcon size={20} color="currentColor" />}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;
