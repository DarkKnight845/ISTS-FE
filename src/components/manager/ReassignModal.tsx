import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { CloseIcon } from '@/components/icons';
import type { AgentDto } from '@/lib/api';

interface ReassignModalProps {
  open: boolean;
  onClose: () => void;
  onReassign: (agentId: string) => void;
  agents: AgentDto[];
  ticketId: string;
  loading?: boolean;
}

function ReassignModal({ open, onClose, onReassign, agents, ticketId, loading = false }: ReassignModalProps) {
  const [selected, setSelected] = useState<string>('');
  const theme = useTheme();

  const handleClose = () => {
    setSelected('');
    onClose();
  };

  const handleReassign = () => {
    if (selected) {
      onReassign(selected);
      setSelected('');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 0,
            m: { xs: '16px', sm: '32px' },
            width: { xs: '100%', sm: '480px' },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          p: '24px 24px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '18px' }}>
            Reassign ticket
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '14px' }}>
            Select an agent to handle {ticketId}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary', p: '4px' }}>
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '16px 24px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {loading ? (
            <Typography sx={{ color: 'text.secondary', fontSize: '14px', textAlign: 'center', py: 2 }}>
              Loading agents...
            </Typography>
          ) : agents.length === 0 ? (
            <Typography sx={{ color: 'text.secondary', fontSize: '14px', textAlign: 'center', py: 2 }}>
              No agents available.
            </Typography>
          ) : (
            agents.map((agent) => (
            <Box
              key={agent.id}
              onClick={() => setSelected(agent.id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                p: '12px',
                borderRadius: '10px',
                border: '1px solid',
                borderColor: selected === agent.id ? 'primary.main' : theme.palette.divider,
                backgroundColor: selected === agent.id ? theme.palette.action.hover : theme.palette.background.paper,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Radio
                checked={selected === agent.id}
                onChange={() => setSelected(agent.id)}
                sx={{
                  color: theme.palette.divider,
                  p: 0,
                  '&.Mui-checked': { color: 'primary.main' },
                }}
              />
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {agent.initials}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 500 }}>
                {agent.fullName}
              </Typography>
            </Box>
          ))
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px 24px', gap: '12px' }}>
        <Button
          onClick={handleClose}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            fontWeight: 500,
            fontSize: '14px',
            px: '20px',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!selected || loading}
          onClick={handleReassign}
          sx={{
            textTransform: 'none',
            backgroundColor: 'primary.main',
            fontWeight: 500,
            fontSize: '14px',
            px: '24px',
            borderRadius: '8px',
            '&:hover': { backgroundColor: 'primary.dark' },
            '&.Mui-disabled': { backgroundColor: theme.palette.action.disabledBackground, color: theme.palette.text.disabled },
          }}
        >
          {loading ? 'Reassigning...' : 'Reassign ticket'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ReassignModal;
