import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import type { Ticket, TicketPriority, TicketStatus } from '../data/mockTickets';
import { MoreIcon } from './icons';

const SortIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M7 16V4M7 4L4 7M7 4L10 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 8V20M17 20L14 17M17 20L20 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

interface TicketTableProps {
  tickets: Ticket[];
  onSelect: (ticket: Ticket) => void;
}

const statusStyles: Record<TicketStatus, { bg: string; color: string; border: string }> = {
  Active: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
  Resolved: { bg: '#D1FAE5', color: '#047857', border: '#6EE7B7' },
  Ongoing: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
  Open: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
  InProgress: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
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
function TicketTable({ tickets, onSelect }: TicketTableProps) {
  const theme = useTheme();
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
            <TableCell sx={headSx}>ID &amp; Subject</TableCell>
            <TableCell align="center" sx={headSx}>Status</TableCell>
            <TableCell align="center" sx={headSx}>Priority</TableCell>
            <TableCell align="center" sx={headSx}>Assigned</TableCell>
            <TableCell align="center" sx={headSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                Time Updated
                <SortIcon />
              </Box>
            </TableCell>
            <TableCell align="right" sx={headSx}>Actions</TableCell>
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
                    {ticket.id}
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

                <TableCell align="right" sx={cellSx}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '8px', color: 'text.secondary' }}
                  >
                    <MoreIcon size={18} />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TicketTable;
