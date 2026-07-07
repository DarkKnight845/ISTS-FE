import { Box, type SxProps, type Theme } from '@mui/material';
import ticketStatSrc from '@/assets/icons/ion_ticket_stat.svg';
import ticketOrangeSrc from '@/assets/icons/ion_ticket_orange.svg';
import ticketGreenSrc from '@/assets/icons/ion_ticket_green.svg';
import ticketRedSrc from '@/assets/icons/ion_ticket_red.svg';

interface IconProps {
  size?: number | string;
  color?: string;
  sx?: SxProps<Theme>;
}

function svgIcon(viewBox: string, path: React.ReactNode) {
  return function Icon({ size = 20, color = 'currentColor', sx }: IconProps) {
    return (
      <Box
        component="svg"
        viewBox={viewBox}
        sx={{
          width: size,
          height: size,
          flexShrink: 0,
          color,
          ...sx,
        }}
      >
        {path}
      </Box>
    );
  };
}

// Staff-dashboard ticket SVG assets.
export function TicketSubmittedIcon({ size = 25 }: IconProps) {
  return <Box component="img" src={ticketStatSrc} alt="Submitted" sx={{ width: size, height: size, display: 'block' }} />;
}

export function TicketInProgressIcon({ size = 25 }: IconProps) {
  return <Box component="img" src={ticketOrangeSrc} alt="In progress" sx={{ width: size, height: size, display: 'block' }} />;
}

export function TicketResolvedIcon({ size = 25 }: IconProps) {
  return <Box component="img" src={ticketGreenSrc} alt="Resolved" sx={{ width: size, height: size, display: 'block' }} />;
}

export function TicketUrgentIcon({ size = 25 }: IconProps) {
  return <Box component="img" src={ticketRedSrc} alt="Urgent" sx={{ width: size, height: size, display: 'block' }} />;
}

// Common line-art icons using currentColor so they adapt to theme.
export const DashboardIcon = svgIcon(
  '0 0 24 24',
  <>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
  </>
);

export const TicketIcon = svgIcon(
  '0 0 24 24',
  <>
    <path
      d="M2 9V15C2 17 3 18 5 18H19C21 18 22 17 22 15V9C22 7 21 6 19 6H5C3 6 2 7 2 9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M6 6V4M18 6V4M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>
);

export const TicketTagIcon = svgIcon(
  '0 0 24 24',
  <>
    <path
      d="M2 9V15C2 17 3 18 5 18H19C21 18 22 17 22 15V9C22 7 21 6 19 6H5C3 6 2 7 2 9Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M6 6V4M18 6V4M9 14H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16" cy="13" r="1.5" fill="currentColor" />
  </>
);

export const AnalyticsIcon = svgIcon(
  '0 0 24 24',
  <>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>
);

export const CalendarIcon = svgIcon(
  '0 0 24 24',
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>
);

export const BellIcon = svgIcon(
  '0 0 24 24',
  <path
    d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18.5 16V11C18.5 7.93 16.86 5.36 14 4.68V4C14 3.17 13.33 2.5 12.5 2.5C11.67 2.5 11 3.17 11 4V4.68C8.14 5.36 6.5 7.92 6.5 11V16L4 18.5V19.5H21V18.5L18.5 16Z"
    fill="currentColor"
  />
);

export const CloseIcon = svgIcon(
  '0 0 24 24',
  <>
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

export const MoreIcon = svgIcon(
  '0 0 24 24',
  <>
    <circle cx="12" cy="6" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="18" r="2" fill="currentColor" />
  </>
);

export const AttachmentIcon = svgIcon(
  '0 0 24 24',
  <path
    d="M21.44 11.05L12.25 20.24C11.12 21.37 9.63 22 8.08 22C6.53 22 5.04 21.37 3.91 20.24C2.78 19.11 2.15 17.62 2.15 16.07C2.15 14.52 2.78 13.03 3.91 11.9L13.1 2.71C13.83 1.98 14.79 1.57 15.79 1.57C16.79 1.57 17.75 1.98 18.48 2.71C19.21 3.44 19.62 4.4 19.62 5.4C19.62 6.4 19.21 7.36 18.48 8.09L9.25 17.32C8.89 17.68 8.39 17.88 7.87 17.88C7.35 17.88 6.85 17.68 6.49 17.32C6.13 16.96 5.93 16.46 5.93 15.94C5.93 15.42 6.13 14.92 6.49 14.56L15.66 5.39"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);

export const SendIcon = svgIcon(
  '0 0 24 24',
  <>
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

export const RatingIcon = svgIcon(
  '0 0 24 24',
  <path
    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
    fill="currentColor"
  />
);

export const SlaBreachIcon = svgIcon(
  '0 0 24 24',
  <>
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </>
);

export const SlaComplianceIcon = svgIcon(
  '0 0 24 24',
  <>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7 12L10.5 15.5L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

export const TrendUpIcon = svgIcon(
  '0 0 24 24',
  <path d="M12 4L4 14H20L12 4Z" fill="currentColor" />
);

export const TrendDownIcon = svgIcon(
  '0 0 24 24',
  <path d="M12 20L20 10H4L12 20Z" fill="currentColor" />
);

export const CheckCircleIcon = svgIcon(
  '0 0 24 24',
  <>
    <circle cx="12" cy="12" r="10" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
    <path d="M7 12L10.5 15.5L17 9" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </>
);

export const SunIcon = svgIcon(
  '0 0 24 24',
  <>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </>
);

export const MoonIcon = svgIcon(
  '0 0 24 24',
  <path
    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
  />
);
