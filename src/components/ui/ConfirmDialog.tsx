import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmColor?: 'primary' | 'error' | 'warning';
  loading?: boolean;
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmColor = 'primary',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', p: 0, m: { xs: '16px', sm: '32px' }, width: { xs: '100%', sm: '380px' } },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary', pt: 3, px: 3, pb: 1 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 1 }}>
        <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 1.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}
        >
          {loading ? <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
