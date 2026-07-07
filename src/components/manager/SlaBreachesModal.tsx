import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
} from '@mui/material';
import { CloseIcon } from '@/components/icons';
import type { ManagerTicket } from '@/data/mockManagerTickets';

interface SlaBreachesModalProps {
  open: boolean;
  onClose: () => void;
  tickets: ManagerTicket[];
  onRowClick: (ticket: ManagerTicket) => void;
}

function SlaBreachesModal({ open, onClose, tickets, onRowClick }: SlaBreachesModalProps) {
  const theme = useTheme();
  const breaches = tickets.filter((t) => t.isBreach);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 0,
            m: { xs: '16px', sm: '32px' },
            width: { xs: '100%', sm: '800px' },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          p: '24px 24px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '18px' }}>
            SLA breaches
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, fontSize: '14px' }}>
            {breaches.length} ticket{breaches.length === 1 ? '' : 's'} currently past SLA
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'text.secondary', p: '4px' }}>
          <CloseIcon size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: '8px 24px 16px' }}>
        <Paper
          sx={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '12px',
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: 'background.paper',
            boxShadow: 'none',
          }}
        >
          <TableContainer>
            <Table stickyHeader sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  {['Ticket ID', 'Subject', 'Requester', 'Assigned to', 'Overdue by'].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontWeight: 600,
                        fontSize: '13px',
                        color: 'text.secondary',
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        py: '12px',
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {breaches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: 'center', py: '24px', color: 'text.secondary' }}>
                      No SLA breaches found.
                    </TableCell>
                  </TableRow>
                ) : (
                  breaches.map((ticket, index) => (
                    <TableRow
                      key={`${ticket.id}-${index}`}
                      hover
                      onClick={() => {
                        onRowClick(ticket);
                        onClose();
                      }}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell sx={{ fontSize: '13px', color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {ticket.id}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}`, maxWidth: 220 }}>
                        <Typography noWrap sx={{ fontSize: '13px', color: 'text.primary' }}>
                          {ticket.subject}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', color: 'text.secondary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {ticket.requester}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', color: 'text.primary', borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {ticket.assigned || 'Unassigned'}
                      </TableCell>
                      <TableCell sx={{ fontSize: '13px', color: 'error.main', fontWeight: 600, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        {ticket.overdueBy || '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: '16px 24px 24px' }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            textTransform: 'none',
            backgroundColor: 'primary.main',
            fontWeight: 500,
            fontSize: '14px',
            px: '24px',
            borderRadius: '8px',
            '&:hover': { backgroundColor: 'primary.dark' },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SlaBreachesModal;
