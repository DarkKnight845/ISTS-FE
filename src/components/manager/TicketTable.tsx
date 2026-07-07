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

const statusTextColors: Record<string, string> = {
  Active: '#1E40AF',
  Ongoing: '#7C3AED',
  Resolved: '#047857',
};

function TicketTable({ tickets, onRowClick }: TicketTableProps) {
  return (
    <Paper
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: 'none',
      }}
    >
      <TableContainer>
        <Table stickyHeader sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
              {['Ticket ID', 'Subject', 'Requester', 'Priority', 'Status', 'Assigned to', 'Created', 'Last updated'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 600,
                    fontSize: '13px',
                    color: '#374151',
                    borderBottom: '1px solid #E5E7EB',
                    py: '14px',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket, index) => (
              <TableRow
                key={`${ticket.id}-${index}`}
                hover
                onClick={() => onRowClick(ticket)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#F9FAFB' },
                }}
              >
                <TableCell sx={{ fontSize: '13px', color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                  {ticket.id}
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: '#111827', borderBottom: '1px solid #E5E7EB', maxWidth: 260 }}>
                  <Typography noWrap sx={{ fontSize: '13px', color: '#111827' }}>
                    {ticket.subject}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>
                  {ticket.requester}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #E5E7EB' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: '10px',
                      py: '4px',
                      borderRadius: '999px',
                      backgroundColor: priorityColors[ticket.priority] || '#F3F4F6',
                      color: priorityTextColors[ticket.priority] || '#374151',
                      fontSize: '12px',
                      fontWeight: 500,
                    }}
                  >
                    {ticket.priority}
                  </Box>
                </TableCell>
                <TableCell sx={{ fontSize: '13px', fontWeight: 500, color: statusTextColors[ticket.status] || '#374151', borderBottom: '1px solid #E5E7EB' }}>
                  {ticket.status}
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: '#111827', borderBottom: '1px solid #E5E7EB' }}>
                  {ticket.assigned || <Typography component="span" sx={{ color: '#9CA3AF' }}>Unassigned</Typography>}
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: '#6B7280', borderBottom: '1px solid #E5E7EB' }}>
                  {ticket.createdAt}
                </TableCell>
                <TableCell sx={{ fontSize: '13px', color: ticket.isBreach ? '#DC2626' : '#6B7280', fontWeight: ticket.isBreach ? 600 : 400, borderBottom: '1px solid #E5E7EB' }}>
                  {ticket.isBreach && ticket.overdueBy ? `Overdue by ${ticket.overdueBy}` : ticket.updatedAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TicketTable;
