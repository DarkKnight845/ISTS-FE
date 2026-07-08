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

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { MoreIcon } from "@/components/icons";
import type { Ticket, TicketStatus } from "@/components/ui/types/ticket";


type StaffTableProps = {
  tickets: Ticket[];
  onRowClick?: (ticket: Ticket) => void;
};

const statusStyles: Record<TicketStatus, { bg: string; color: string; border: string }> = {
  Open: { bg: '#DBEAFE', color: '#1D4ED8', border: '#93C5FD' },
  InProgress: { bg: '#FEF3C7', color: '#B45309', border: '#FCD34D' },
  Resolved: { bg: '#D1FAE5', color: '#047857', border: '#6EE7B7' },
  Closed: { bg: '#E5E7EB', color: '#374151', border: '#D1D5DB' },
  Waiting: { bg: '#D7EBFF', color: '#1565C0', border: '#1565C0' },
};
const formatTicketId = (id: string | number): string => {
  return `TKT-${String(id).slice(0, 5)}`;
};

function StaffTable({ tickets, onRowClick }: StaffTableProps) {
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
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: .5,
                }}
              >
                CATEGORY
                <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
              </Box>
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: .5,
                }}
              >
                STATUS
                <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />
              </Box>
            </TableCell>

            <TableCell
              sx={{
                fontWeight: 600,
                color: "text.secondary",
                fontSize: 13,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: .5,
                }}
              >
                TIME UPDATED
                <ImportExportIcon sx={{ fontSize: 15 }} />
              </Box>
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
                  <IconButton size="small" sx={{ color: 'text.secondary' }}>
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

export default StaffTable;