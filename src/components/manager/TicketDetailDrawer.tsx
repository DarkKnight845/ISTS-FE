import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { ManagerTicket } from '@/data/mockManagerTickets';

interface TicketDetailDrawerProps {
  open: boolean;
  ticket: ManagerTicket | null;
  onClose: () => void;
  onReassign: () => void;
}

const priorityStyles: Record<string, { bg: string; text: string }> = {
  Urgent: { bg: '#FEE2E2', text: '#DC2626' },
  High: { bg: '#FEF3C7', text: '#B45309' },
  Medium: { bg: '#ECFDF5', text: '#047857' },
  Low: { bg: '#F3F4F6', text: '#374151' },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  Open: { bg: '#DBEAFE', text: '#1D4ED8' },
  Ongoing: { bg: '#FEF3C7', text: '#D97706' },
  Resolved: { bg: '#D1FAE5', text: '#059669' },
  Closed: { bg: '#E5E7EB', text: '#374151' },
};

function getInitials(name: string | null) {
  if (!name) return '—';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function TicketDetailDrawer({ open, ticket, onClose, onReassign }: TicketDetailDrawerProps) {
  if (!ticket) return null;

  const priority = priorityStyles[ticket.priority] || priorityStyles.Low;
  const status = statusStyles[ticket.status] || { bg: '#F3F4F6', text: '#374151' };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        root: {
          sx: {
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(15, 23, 42, 0.25)',
              backdropFilter: 'blur(4px)',
            },
          },
        },
        paper: {
          sx: {
            width: { xs: '100%', sm: '440px' },
            p: 0,
            boxSizing: 'border-box',
            backgroundColor: 'background.paper',
            boxShadow: 5,
          },
        },
      }}
    >
      <Box sx={{ p: '28px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, fontSize: 13, bgcolor: 'action.selected', color: 'text.secondary' }}>
              {getInitials(ticket.requester)}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '17px' }}>
                {ticket.subject}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '12px', mt: 0.25 }}>
                TKT-{ticket.id.slice(0, 3).toUpperCase()} • {ticket.requester}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'text.secondary',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              width: 36,
              height: 36,
              '&:hover': { color: 'text.primary', backgroundColor: 'action.hover' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3, borderColor: 'divider' }} />

        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          <Chip
            label={ticket.priority}
            sx={{
              backgroundColor: priority.bg,
              color: priority.text,
              fontWeight: 700,
              fontSize: '12px',
              borderRadius: '8px',
            }}
          />
          <Chip
            label={ticket.status}
            sx={{
              backgroundColor: status.bg,
              color: status.text,
              fontWeight: 700,
              fontSize: '12px',
              borderRadius: '8px',
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
          <DetailRow label="Requester" value={ticket.requester} />
          <DetailRow label="Created" value={ticket.createdAt} />
          <DetailRow label="Last updated" value={ticket.updatedAt} />
          <DetailRow
            label="Assigned to"
            value={ticket.assigned || 'Unassigned'}
            avatar={ticket.assigned ? getInitials(ticket.assigned) : undefined}
          />

          {ticket.isBreach && ticket.overdueBy && (
            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid',
                borderColor: 'rgba(239, 68, 68, 0.25)',
              }}
            >
              <Typography sx={{ color: '#EF4444', fontSize: '13px', fontWeight: 600 }}>
                SLA breach: overdue by {ticket.overdueBy}
              </Typography>
            </Box>
          )}

          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', fontWeight: 600 }}>
              Description
            </Typography>
            <Typography variant="body2" sx={{ mt: '8px', color: 'text.primary', fontSize: '14px', lineHeight: 1.7 }}>
              {ticket.description || 'No description provided.'}
            </Typography>

            {ticket.attachmentUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 600 }}>
                  Attachment
                </Typography>
                <Box
                  component="img"
                  src={ticket.attachmentUrl}
                  alt="Ticket attachment"
                  onClick={() => {
                    if (ticket.attachmentUrl) window.open(ticket.attachmentUrl, '_blank');
                  }}
                  sx={{
                    width: '100%',
                    maxHeight: 260,
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.95 },
                  }}
                />
              </Box>
            )}
          </Box>

          {ticket.status !== 'Resolved' && ticket.status !== 'Closed' && (
            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Button
                fullWidth
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={onReassign}
                sx={{
                  height: '46px',
                  textTransform: 'none',
                  borderRadius: '10px',
                  backgroundColor: 'primary.main',
                  fontWeight: 600,
                  fontSize: '14px',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                Reassign ticket
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  );
}

function DetailRow({
  label,
  value,
  avatar,
}: {
  label: string;
  value: string;
  avatar?: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px', fontWeight: 600 }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {avatar && avatar !== '—' && (
          <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: 'primary.main', color: 'primary.contrastText' }}>{avatar}</Avatar>
        )}
        <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '14px', fontWeight: 600, textAlign: 'right' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default TicketDetailDrawer;
