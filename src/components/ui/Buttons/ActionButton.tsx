import {
  CSVIcon,
  FilterIcon,
  VerticalEllipsisDark,
} from '@/assets/icons'
import CustomButton from './CustomButton'
import CustomIconButton from './IconButton'
import { useTheme, Typography, type SxProps } from '@mui/material'

export interface ActionButton {
  text?: string
  type:
    | 'filter'
    | 'download'
    | 'view'
    | 'edit'
    | 'more'
  icon?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  tooltip?: string
  disabled?: boolean
  sx?: SxProps
  iconStyle?: SxProps
}
const getActionIcon = (type: string, iconStyle?: SxProps) => {
  const style = { fontSize: '18px', ...iconStyle }
  switch (type) {
    case 'edit':
      return <FilterIcon sx={style} />
    case 'view':
      return <FilterIcon sx={style} />
    case 'filter':
      return <FilterIcon sx={style} />
    case 'download':
      return <CSVIcon sx={style} />
    case 'more':
      return <VerticalEllipsisDark sx={style} />
    default:
      return <></>
  }
}

const ActionButton: React.FC<ActionButton> = ({
  text,
  type,
  icon,
  onClick,
  tooltip,
  disabled,
  sx,
}) => {
  const theme = useTheme()
  const buttonStyle = {
    border: {
      xs: 'none',
      sm: 'none',
      lg: `0.5px solid ${theme.palette.grey[100]}`,
    },
    borderRadius: '100px',
    p: {
      xs: '0px',
      sm: '0px',
      lg: '10px 20px',
    },

    minWidth: { xs: '32px' },
    color: disabled ? 'grey.400' : 'primary.main',
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...sx,
  }
  return (
    <>
      {icon ? (
        <CustomIconButton
          onClick={
            !disabled ? onClick : () => console.log('remove from disabled')
          }
          sx={buttonStyle}
          tooltip={
            disabled
              ? ''
              : tooltip ?? type.charAt(0).toUpperCase() + type.substring(1)
          }
        >
          {getActionIcon(type)}
        </CustomIconButton>
      ) : (
        <CustomButton
          onClick={onClick}
          startIcon={getActionIcon(type)}
          variant='outlined'
          sx={{
            ...buttonStyle,
            p: {
              xs: '0px',
              sm: '0px',
              lg: '10px 20px',
            },
          }}
        >
          {/* {(text?.charAt(0)?.toUpperCase()) + "" + text?.substring(1)} */}{' '}
          <Typography
            component='span'
            sx={{
              display: {
                xs: 'none',
                sm: 'inline',
                fontSize: '12px',
                fontWeight: '500',
              },
            }}
          >
            {(text?.charAt(0)?.toUpperCase() ?? '') +
              (text?.substring(1) ?? '')}
          </Typography>
        </CustomButton>
      )}
    </>
  )
}

export default ActionButton
