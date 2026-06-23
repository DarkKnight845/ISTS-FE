import React from 'react';
import { IconButton as MuiIconButton, type IconButtonProps, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledIconButton = styled(MuiIconButton)(({ theme, size }) => {
  // const isPaletteColor = color && color in theme.palette;

  return {
    borderRadius: '8px',
    //   color: isPaletteColor ? theme.palette[color as keyof typeof theme.palette].main : 'inherit',
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
    padding: size === 'small' ? '4px' : size === 'large' ? '12px' : '8px', // Add dynamic padding
    //   '&:hover': {
    //     backgroundColor: isPaletteColor
    //       ? theme.palette[color as keyof typeof theme.palette].light
    //       : theme.palette.action.hover,
    //   },
    '&.Mui-disabled': {
      color: theme.palette.action.disabled,
      backgroundColor: theme.palette.action.disabledBackground,
    },
  };
});


interface CustomIconButtonProps extends IconButtonProps {
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  tooltip?: string; // Optional tooltip for the icon button ✌️🫂
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  children,
  color = 'primary',
  tooltip,
  disabled = false,
  ...props
}) => {
  return (
    <Tooltip title={tooltip ?? ""}>
      <StyledIconButton
        {...props}
        disableTouchRipple
        color={color}
        disabled={disabled}
        aria-label={tooltip}
      >
        {children}
      </StyledIconButton>
    </Tooltip>
  );
};

export default CustomIconButton;
