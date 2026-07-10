import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import type { Ticket, TicketStatus } from "@/components/ui/types/ticket";


type StaffTableProps = {
  tickets: Ticket[];
  onRowClick?: (ticket: Ticket) => void;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (ticket: Ticket) => void;
};

const statusStyles: Record<TicketStatus, { bg: string; color: string; border: string }> = {
  Open: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
  Ongoing: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
  Resolved: { bg: '#D1FAE5', color: '#047857', border: '#6EE7B7' },
  Closed: { bg: '#E5E7EB', color: '#374151', border: '#D1D5DB' },
  Waiting: { bg: '#D7EBFF', color: '#1565C0', border: '#1565C0' },
};
const formatTicketId = (id: string): string => `TKT-${id.slice(0, 3).toUpperCase()}`;

function StaffTable({ tickets, onRowClick, onEdit, onDelete }: StaffTableProps) {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <Table>

        <TableHead>

          <TableRow
            sx={{
              backgroundColor: "action.hover",
            }}
          >
            <TableCell
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              TICKET ID
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              SUBJECT
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              CATEGORY
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              STATUS
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              TIME UPDATED
            </TableCell>

            <TableCell
              align="center"
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              ACTIONS
            </TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {tickets.map((ticket) => {
            const status = statusStyles[ticket.status];
            const isCompleted = ticket.status === 'Resolved' || ticket.status === 'Closed';
            return (
              <TableRow
                key={ticket.id}
                hover
                onClick={() => onRowClick?.(ticket)}
                sx={{
                  cursor: onRowClick ? 'pointer' : 'default',
                  "&:last-child td": {
                    borderBottom: "none",
                  },
                }}
              >
                <TableCell>
                  <Typography
                    sx={{
                      color: "primary.main",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {formatTicketId(ticket.id)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>
                    {ticket.subject}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    sx={{
                      fontStyle: "italic",
                      color: "text.secondary",
                    }}
                  >
                    {ticket.category}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={ticket.status}
                    sx={{
                      backgroundColor: status.bg,
                      color: status.color,
                      border: `1px solid ${status.border}`,
                      borderRadius: "20px",
                      fontWeight: 500,
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Typography sx={{ fontWeight: 500 }}>
                    {ticket.updatedAt}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      disabled={isCompleted}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(ticket);
                      }}
                      sx={{ color: isCompleted ? 'action.disabled' : 'text.secondary' }}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(ticket);
                      }}
                      sx={{ color: 'text.secondary' }}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}

        </TableBody>

      </Table>
    </TableContainer>
  );
}

export default StaffTable;