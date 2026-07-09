import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import type { ManagerTicket } from '@/data/mockManagerTickets';

interface TicketTableProps {
  tickets: ManagerTicket[];
  onRowClick: (ticket: ManagerTicket) => void;
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

function TicketTable({ tickets, onRowClick }: TicketTableProps) {
  const theme = useTheme();

  const statusStyles = (status: string) => {
    switch (status) {
      case 'Active':
        return { bg: '#DBEAFE', color: '#1D4ED8' };
      case 'Ongoing':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Resolved':
        return { bg: '#D1FAE5', color: '#047857' };
      default:
        return { bg: theme.palette.action.hover, color: theme.palette.text.primary };
    }
  };

  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        bgcolor: 'background.paper',
      }}
    >
      <TableContainer>
        <Table stickyHeader sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              {['Ticket ID', 'Subject', 'Requester', 'Priority', 'Status', 'Assigned to', 'Created', 'Last updated'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 600,
                    fontSize: '13px',
                    color: 'text.secondary',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    py: '14px',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket, index) => {
              const status = statusStyles(ticket.status);
              return (
                <TableRow
                  key={`${ticket.id}-${index}`}
                  hover
                  onClick={() => onRowClick(ticket)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <TableCell sx={{ fontSize: '13px', color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    TKT-{ticket.id.slice(0, 3).toUpperCase()}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, maxWidth: 260 }}>
                    <Typography noWrap sx={{ fontSize: '13px', color: 'text.primary' }}>
                      {ticket.subject}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {ticket.requester}
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: '10px',
                        py: '4px',
                        borderRadius: '999px',
                        backgroundColor: priorityColors[ticket.priority] || theme.palette.action.hover,
                        color: priorityTextColors[ticket.priority] || theme.palette.text.primary,
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {ticket.priority}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', fontWeight: 500, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: '10px',
                        py: '4px',
                        borderRadius: '999px',
                        backgroundColor: status.bg,
                        color: status.color,
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {ticket.status}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {ticket.assigned || <Typography component="span" sx={{ color: 'text.disabled' }}>Unassigned</Typography>}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {ticket.createdAt}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: ticket.isBreach ? 'error.main' : 'text.secondary', fontWeight: ticket.isBreach ? 600 : 400, borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {ticket.isBreach && ticket.overdueBy ? `Overdue by ${ticket.overdueBy}` : ticket.updatedAt}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TicketTable;
