import { useState } from 'react';
import {
  Avatar,
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

const priorityStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Urgent: { bg: '#FEE2E2', text: '#DC2626', dot: '#DC2626' },
  High: { bg: '#FEF3C7', text: '#B45309', dot: '#B45309' },
  Medium: { bg: '#ECFDF5', text: '#047857', dot: '#047857' },
  Low: { bg: '#F3F4F6', text: '#374151', dot: '#374151' },
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

function TicketTable({ tickets, onRowClick }: TicketTableProps) {
  const theme = useTheme();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
              {['Ticket', 'Requester', 'Priority', 'Status', 'Assigned to', 'Created', 'Last updated'].map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontWeight: 600,
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
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
              const priority = priorityStyles[ticket.priority] || priorityStyles.Low;
              const status = statusStyles[ticket.status] || { bg: theme.palette.action.hover, text: theme.palette.text.primary };
              const isHovered = hoveredId === `${ticket.id}-${index}`;
              return (
                <TableRow
                  key={`${ticket.id}-${index}`}
                  hover
                  onClick={() => onRowClick(ticket)}
                  onMouseEnter={() => setHoveredId(`${ticket.id}-${index}`)}
                  onMouseLeave={() => setHoveredId(null)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease, box-shadow 0.18s ease',
                    backgroundColor: isHovered ? 'action.hover' : 'background.paper',
                    boxShadow: isHovered ? 2 : 0,
                    position: 'relative',
                    zIndex: isHovered ? 1 : 0,
                  }}
                >
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <Typography noWrap sx={{ fontSize: '13px', fontWeight: 600, color: 'text.primary', maxWidth: 240 }}>
                        {ticket.subject}
                      </Typography>
                      <Typography sx={{ fontSize: '12px', color: 'text.secondary' }}>
                        TKT-{ticket.id.slice(0, 3).toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 28, height: 28, fontSize: 11, bgcolor: 'action.selected', color: 'text.secondary' }}>
                        {getInitials(ticket.requester)}
                      </Avatar>
                      <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>{ticket.requester}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
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
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: priority.dot }} />
                      {ticket.priority}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        px: '10px',
                        py: '4px',
                        borderRadius: '999px',
                        backgroundColor: status.bg,
                        color: status.text,
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {ticket.status}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {ticket.assigned ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 10, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                          {getInitials(ticket.assigned)}
                        </Avatar>
                        <Typography sx={{ fontSize: '13px', color: 'text.primary', fontWeight: 500 }}>{ticket.assigned}</Typography>
                      </Box>
                    ) : (
                      <Typography component="span" sx={{ color: 'text.disabled', fontSize: '13px', fontStyle: 'italic' }}>
                        Unassigned
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ fontSize: '13px', color: 'text.secondary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                    {ticket.createdAt}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: '13px',
                      color: ticket.isBreach ? 'error.main' : 'text.secondary',
                      fontWeight: ticket.isBreach ? 600 : 400,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
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
