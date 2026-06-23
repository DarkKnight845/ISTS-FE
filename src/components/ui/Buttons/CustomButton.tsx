import React from 'react';
import { type LoadingButtonProps } from '@mui/lab';
import { StyledButton } from '@/styles/StyledComponents/ButtonStyle';





/**
 * Button component for user interactions.
 * 
 * @param {Object} props - The props for the Button component.
 * @param {React.ReactNode} props.children - Content to be displayed inside the button.
 * @param {() => void} props.onClick - Function called when the button is clicked.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {string} [props.variant="contained"] - Whether the button has contained or outlined style.
 * @param {boolean} [props.loading="false"] - Whether the button shows a loader or not.
 * {...props} //You can pass more props based on MUI documentation ✌️
 */

interface CustomButtonProps extends LoadingButtonProps {
  loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  disabled = false,
  loading = false,
  onClick,
  children,
  ...props
}) => {
  return (
    <StyledButton
      {...props}
      disableElevation
      disableFocusRipple
      disableRipple
      disableTouchRipple
      variant={variant}
      color={color}
      disabled={disabled}
      onClick={onClick}
      loading={loading}
    >
      {!loading && children}
    </StyledButton>
  );
};

export default CustomButton;



