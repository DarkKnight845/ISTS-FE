import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { CheckCircleIcon } from '@/components/icons';

interface ReassignSuccessModalProps {
  open: boolean;
  onClose: () => void;
  ticketId: string;
  agentName: string;
}

function ReassignSuccessModal({ open, onClose, ticketId, agentName }: ReassignSuccessModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 0,
            m: { xs: '16px', sm: '32px' },
            width: { xs: '100%', sm: '360px' },
            textAlign: 'center',
          },
        },
      }}
    >
      <DialogContent sx={{ p: '32px 24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <CheckCircleIcon />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '18px', mb: 1 }}>
          Ticket reassigned
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '14px' }}>
          {ticketId} has been successfully reassigned to {agentName}.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px 24px', justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            backgroundColor: 'primary.main',
            fontWeight: 500,
            fontSize: '14px',
            px: '32px',
            borderRadius: '8px',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReassignSuccessModal;
