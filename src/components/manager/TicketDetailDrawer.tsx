import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { ManagerTicket } from '@/data/mockManagerTickets';

interface TicketDetailDrawerProps {
  open: boolean;
  ticket: ManagerTicket | null;
  onClose: () => void;
  onReassign: () => void;
}

const priorityColors: Record<string, string> = {
  Urgent: '#FEF2F2',
  High: '#FEF3C7',
  Medium: '#ECFDF5',
  Low: '#F3F4F6',
};

const priorityTextColors: Record<string, string> = {
  Urgent: '#B91C1C',
  High: '#92400E',
  Medium: '#047857',
  Low: '#374151',
};

const statusTextColors: Record<string, string> = {
  Active: '#1E40AF',
  Ongoing: '#7C3AED',
  Resolved: '#047857',
};

function TicketDetailDrawer({ open, ticket, onClose, onReassign }: TicketDetailDrawerProps) {
  if (!ticket) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: '420px' },
            p: 0,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
          },
        },
      }}
    >
      <Box sx={{ p: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '18px' }}>
              TKT-{ticket.id.slice(0, 3).toUpperCase()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {ticket.subject}
            </Typography>
          </Box>
          <Button
            onClick={onClose}
            sx={{ minWidth: 'auto', p: '4px', color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
          >
            <CloseIcon />
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
          <DetailRow label="Requester" value={ticket.requester} />
          <DetailRow label="Created" value={ticket.createdAt} />
          <DetailRow label="Last updated" value={ticket.updatedAt} />
          <DetailRow label="Assigned to" value={ticket.assigned || 'Unassigned'} />

          {ticket.isBreach && ticket.overdueBy && (
            <DetailRow label="SLA status" value={`Overdue by ${ticket.overdueBy}`} />
          )}

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Priority
            </Typography>
            <Box sx={{ mt: '6px' }}>
              <Chip
                label={ticket.priority}
                sx={{
                  backgroundColor: priorityColors[ticket.priority] || 'action.hover',
                  color: priorityTextColors[ticket.priority] || 'text.primary',
                  fontWeight: 500,
                  fontSize: '12px',
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Status
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: '6px',
                fontWeight: 500,
                color: statusTextColors[ticket.status] || 'text.primary',
                fontSize: '14px',
              }}
            >
              {ticket.status}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ mt: '6px', color: 'text.primary', fontSize: '14px', lineHeight: 1.6 }}>
              {ticket.description}
            </Typography>
          </Box>

          <Box sx={{ mt: 'auto', pt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onReassign}
              sx={{
                height: '44px',
                textTransform: 'none',
                borderRadius: '8px',
                backgroundColor: 'primary.main',
                fontWeight: 500,
                fontSize: '14px',
                '&:hover': { backgroundColor: 'primary.dark' },
              }}
            >
              Reassign ticket
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: '4px', color: 'text.primary', fontSize: '14px', fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );
}

export default TicketDetailDrawer;
