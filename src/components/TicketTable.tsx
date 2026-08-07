import {
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
import type { Ticket, TicketPriority, TicketStatus } from '@/components/ui/types/ticket';

interface TicketTableProps {
  tickets: Ticket[];
  onSelect: (ticket: Ticket) => void;
  /** When provided, render an Edit button per row. */
  onEdit?: (ticket: Ticket) => void;
  /** When provided, render a Delete button per row. */
  onDelete?: (ticket: Ticket) => void;
  /** Predicate controlling whether Delete is enabled for a given row. */
  canDelete?: (ticket: Ticket) => boolean;
}

const statusStyles: Record<TicketStatus, { bg: string; color: string; border: string }> = {
  Open: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
  Ongoing: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
  Resolved: { bg: '#D1FAE5', color: '#047857', border: '#6EE7B7' },
  Closed: { bg: '#E5E7EB', color: '#374151', border: '#D1D5DB' },
  Waiting: { bg: '#D7EBFF', color: '#1565C0', border: '#1565C0' },
};

const priorityColors: Record<TicketPriority, string> = {
  Urgent: '#DC2626',
  High: '#F59E0B',
  Medium: '#3B82F6',
  Low: '#6B7280',
  Critical: '#DC2626',
};

/**
 * Ticket list table with status/priority styling and row selection.
 */
function TicketTable({ tickets, onSelect, onEdit, onDelete, canDelete }: TicketTableProps) {
  const theme = useTheme();
  const showActions = Boolean(onEdit || onDelete);
  const headSx = {
    color: theme.palette.text.secondary,
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: `1px solid ${theme.palette.divider}`,
    py: 1.5,
  };
  const cellSx = {
    py: 2.5,
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
        overflow: 'visible',
      }}
    >
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={headSx}>ID & Subject</TableCell>
            <TableCell align="center" sx={headSx}>Status</TableCell>
            <TableCell align="center" sx={headSx}>Priority</TableCell>
            <TableCell align="center" sx={headSx}>Assigned</TableCell>
            <TableCell align="center" sx={headSx}>Time Updated</TableCell>
            {showActions && (
              <TableCell align="center" sx={headSx}>Actions</TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {tickets.map((ticket) => {
            const status = statusStyles[ticket.status];
            return (
              <TableRow
                key={`${ticket.id}-${ticket.assigned ?? 'unassigned'}`}
                onClick={() => onSelect(ticket)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: theme.palette.action.hover },
                  '&:last-child td': { borderBottom: 0 },
                }}
              >
                <TableCell sx={{ ...cellSx, width: '30%' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    TKT-{ticket.id.slice(0, 3).toUpperCase()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    {ticket.createdAt}
                  </Typography>
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  <Chip
                    label={ticket.status}
                    sx={{
                      backgroundColor: status.bg,
                      color: status.color,
                      fontWeight: 500,
                      fontSize: 12,
                      height: 28,
                      borderRadius: '14px',
                      px: 1,
                      border: `1px solid ${status.border}`,
                    }}
                  />
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: priorityColors[ticket.priority],
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                      {ticket.priority}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {ticket.assigned ?? '--'}
                  </Typography>
                </TableCell>

                <TableCell align="center" sx={cellSx}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                          sx={{ color: 'text.secondary' }}
                          aria-label="Edit ticket"
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton
                          size="small"
                          onClick={() => onDelete(ticket)}
                          disabled={canDelete ? !canDelete(ticket) : false}
                          sx={{ color: 'text.secondary' }}
                          aria-label="Delete ticket"
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
