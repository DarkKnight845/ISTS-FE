import {
  Avatar,
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  useTheme,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import type { Ticket, TicketPriority, TicketStatus } from '@/components/ui/types/ticket';

interface TicketTableProps {
  tickets: Ticket[];
  onSelect: (ticket: Ticket) => void;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticket: Ticket) => void;
  canDelete?: (ticket: Ticket) => boolean;
}

const statusStyles: Record<TicketStatus, { bg: string; color: string; border: string }> = {
  Open: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
  Ongoing: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
  Resolved: { bg: '#D1FAE5', color: '#047857', border: '#6EE7B7' },
  Closed: { bg: '#E5E7EB', color: '#374151', border: '#D1D5DB' },
  Waiting: { bg: '#D7EBFF', color: '#1565C0', border: '#1565C0' },
};

const priorityStyles: Record<TicketPriority, { dot: string; bg: string; text: string }> = {
  Urgent: { dot: '#DC2626', bg: '#FEE2E2', text: '#DC2626' },
  High: { dot: '#F59E0B', bg: '#FEF3C7', text: '#B45309' },
  Medium: { dot: '#3B82F6', bg: '#ECFDF5', text: '#047857' },
  Low: { dot: '#6B7280', bg: '#F3F4F6', text: '#374151' },
  Critical: { dot: '#DC2626', bg: '#FEE2E2', text: '#DC2626' },
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

/**
 * Ticket list table with status/priority styling and row selection.
 */
function TicketTable({ tickets, onSelect, onEdit, onDelete, canDelete }: TicketTableProps) {
  const theme = useTheme();
  const showActions = Boolean(onEdit || onDelete);
  const headSx = {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: `1px solid ${theme.palette.divider}`,
    py: '14px',
  };
  const cellSx = {
    borderBottom: `1px solid ${theme.palette.divider}`,
    verticalAlign: 'middle',
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: '16px',
        boxShadow: 'none',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={headSx}>Ticket</TableCell>
            <TableCell align="center" sx={headSx}>Status</TableCell>
            <TableCell align="center" sx={headSx}>Priority</TableCell>
            <TableCell align="center" sx={headSx}>Assigned</TableCell>
            <TableCell align="center" sx={headSx}>Last updated</TableCell>
            {showActions && <TableCell align="center" sx={headSx}>Actions</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets.map((ticket) => {
            const status = statusStyles[ticket.status];
            const priority = priorityStyles[ticket.priority];
            return (
              <TableRow
                key={`${ticket.id}-${ticket.assigned ?? 'unassigned'}`}
                onClick={() => onSelect(ticket)}
                sx={{
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease, box-shadow 0.18s ease',
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    boxShadow: 2,
                  },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                <TableCell sx={cellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: 'action.selected', color: 'text.secondary' }}>
                      {getInitials(ticket.requester)}
                    </Avatar>
                    <Box>
                      <Typography noWrap sx={{ fontWeight: 600, color: 'text.primary', fontSize: '14px', maxWidth: 260 }}>
                        {ticket.subject}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          TKT-{ticket.id.slice(0, 3).toUpperCase()} • {ticket.createdAt}
                        </Typography>
                        {ticket.attachmentUrl && (
                          <AttachFileIcon sx={{ fontSize: 14, color: 'text.disabled' }} aria-label="Has attachment" />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  <Chip
                    label={ticket.status}
                    sx={{
                      backgroundColor: status.bg,
                      color: status.color,
                      fontWeight: 600,
                      fontSize: 12,
                      height: 26,
                      borderRadius: '13px',
                      px: 1,
                      border: `1px solid ${status.border}`,
                    }}
                  />
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      px: '10px',
                      py: '4px',
                      borderRadius: '999px',
                      backgroundColor: priority.bg,
                      color: priority.text,
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: priority.dot }} />
                    {ticket.priority}
                  </Box>
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  {ticket.assigned ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 22, height: 22, fontSize: 9, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        {getInitials(ticket.assigned)}
                      </Avatar>
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '13px' }}>
                        {ticket.assigned}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'text.disabled', fontSize: '13px', fontStyle: 'italic' }}>
                      Unassigned
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px' }}>
                    {ticket.updatedAt}
                  </Typography>
                </TableCell>

                {showActions && (
                  <TableCell align="center" sx={cellSx} onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      {onEdit && (
                        <IconButton
                          size="small"
                          onClick={() => onEdit(ticket)}
                          disabled={ticket.status === 'Resolved' || ticket.status === 'Closed'}
                          aria-label="Edit ticket"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'primary.main', backgroundColor: 'action.hover' },
                          }}
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(ticket)}
                          disabled={canDelete ? !canDelete(ticket) : false}
                          aria-label="Delete ticket"
                          sx={{
                            color: 'text.secondary',
                            '&:hover': { color: 'error.main', backgroundColor: 'action.hover' },
                          }}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TicketTable;
