import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputBase,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/layout/PageHeader';
import StaffStatsCardGrid from '@/components/StaffStatsCardGrid';
import TicketFilterBar from '@/components/TicketFilterBar';
import TicketTable from '@/components/TicketTable';
import DateRangeFilter from '@/components/DateRangeFilter';
import RaiseTicketModal from '@/components/ui/Modals/RaiseTicketModals';
import { useTicketDrawer } from '@/context/TicketDrawerContext';
import { useTicketSync } from '@/context/TicketSyncContext';
import type { Ticket, TicketStatus } from '@/components/ui/types/ticket';
import { useMyTickets } from '@/hooks/useMyTickets';
import { useSignalR } from '@/hooks/useSignalR';
import type { TicketResponseDto, TicketMessageDto, NotificationDto, DepartmentDto } from '@/lib/api';
import {
  createTicketRequest,
  deleteTicketRequest,
  updateTicketRequest,
  getDepartmentsRequest,
  sendTicketMessageRequest,
} from '@/lib/api';

type StaffFilter = 'All' | 'Open' | 'Waiting' | 'Resolved';

const STAFF_FILTER_TABS: readonly StaffFilter[] = ['All', 'Open', 'Waiting', 'Resolved'];

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PRIORITY_OPTIONS: readonly string[] = ['Low', 'Medium', 'High', 'Urgent'];

function StaffDashboardPage() {
  const { tickets: backendTickets, loading, error, refetch } = useMyTickets();
  const { openTicket } = useTicketDrawer();
  const { notifyTicketChanged } = useTicketSync();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<StaffFilter>('All');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editDepartmentId, setEditDepartmentId] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [raiseOpen, setRaiseOpen] = useState(false);

  useEffect(() => {
    if (backendTickets) {
      setTickets(backendTickets.map(mapBackendTicket));
    }
  }, [backendTickets]);

  const handleNewMessage = useCallback(
    (message: TicketMessageDto) => {
      // The drawer subscribes to its own ticket group, so messages for the
      // currently-open ticket arrive in the drawer directly. Here we just
      // refresh the list so counts / status stay current, and broadcast the
      // change so the drawer can pick it up via the ticket-sync bus.
      if (message.ticketId) {
        refetch();
        notifyTicketChanged(message.ticketId);
      }
    },
    [refetch, notifyTicketChanged]
  );

  const handleNewNotification = useCallback(
    (notification: NotificationDto) => {
      // When a notification arrives tied to one of our tickets (e.g. agent
      // accepted, replied, escalated), refresh the list AND tell any open
      // drawer that this ticket changed.
      if (notification.ticketId) {
        refetch();
        notifyTicketChanged(notification.ticketId);
      }
    },
    [refetch, notifyTicketChanged]
  );

  // Page-level listener for cross-ticket updates. The connection itself
  // is owned by TicketDrawerHost at the layout level.
  useSignalR({
    onMessage: handleNewMessage,
    onNotification: handleNewNotification,
  });

  const stats = useMemo(() => {
    const submitted = tickets.length;
    const ongoing = tickets.filter((t) => t.status === 'Ongoing').length;
    const open = tickets.filter((t) => t.status === 'Open').length;
    const resolved = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;
    return { submitted, ongoing, open, resolved };
  }, [tickets]);

  const handleOpenDelete = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setDeleteError(null);
    setDeleteDialogOpen(true);
  };

  const handleCloseDelete = () => {
    if (deleteLoading) return;
    setDeleteDialogOpen(false);
    setTimeout(() => setTicketToDelete(null), 250);
  };

  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const deletedId = ticketToDelete.backendId;
      await deleteTicketRequest(deletedId);
      await refetch();
      notifyTicketChanged(deletedId);
      setDeleteDialogOpen(false);
      setTimeout(() => setTicketToDelete(null), 250);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete ticket');
    } finally {
      setDeleteLoading(false);
    }
  };

  const loadDepartments = async () => {
    setDepartmentsLoading(true);
    try {
      const data = await getDepartmentsRequest();
      setDepartments(data ?? []);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to load departments');
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const handleOpenEdit = (ticket: Ticket) => {
    setTicketToEdit(ticket);
    setEditSubject(ticket.subject);
    setEditDescription(ticket.description);
    setEditPriority(ticket.priority);
    setEditDepartmentId(ticket.departmentId);
    setEditCategoryId(ticket.categoryId);
    setEditError(null);
    setEditDialogOpen(true);
    loadDepartments();
  };

  const handleCloseEdit = () => {
    if (editLoading) return;
    setEditDialogOpen(false);
    setTimeout(() => {
      setTicketToEdit(null);
      setEditSubject('');
      setEditDescription('');
      setEditPriority('');
      setEditDepartmentId('');
      setEditCategoryId('');
      setEditError(null);
    }, 250);
  };

  const handleConfirmEdit = async () => {
    if (!ticketToEdit) return;

    if (!editSubject.trim()) {
      setEditError('Please enter a ticket subject.');
      return;
    }
    if (!editDepartmentId) {
      setEditError('Please select a department.');
      return;
    }
    if (!editCategoryId) {
      setEditError('Please select a category.');
      return;
    }
    if (!editDescription.trim()) {
      setEditError('Please describe your issue.');
      return;
    }
    if (!editPriority) {
      setEditError('Please select a priority.');
      return;
    }

    setEditLoading(true);
    setEditError(null);
    try {
      const editedId = ticketToEdit.backendId;
      await updateTicketRequest(editedId, {
        title: editSubject.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        departmentId: editDepartmentId,
        categoryId: editCategoryId,
      });
      await refetch();
      notifyTicketChanged(editedId);
      setEditDialogOpen(false);
      handleCloseEdit();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update ticket');
    } finally {
      setEditLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    if (!editDepartmentId) return [];
    const dept = departments.find((d) => d.id === editDepartmentId);
    return dept?.categories ?? [];
  }, [editDepartmentId, departments]);

  function isDateInRange(isoDate: string, start?: string, end?: string) {
    if (!start && !end) return true;
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return true;

    if (start) {
      const startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
      if (date < startDate) return false;
    }

    if (end) {
      const endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
      if (date > endDate) return false;
    }

    return true;
  }

  const filteredTickets = useMemo(() => {
    let working = tickets;

    if (filter !== 'All') {
      working = working.filter((ticket) => {
        switch (filter) {
          case 'Open':
            return ticket.status === 'Open';
          case 'Waiting':
            return ticket.status === 'Ongoing' || ticket.status === 'Waiting';
          case 'Resolved':
            return ticket.status === 'Resolved' || ticket.status === 'Closed';
          default:
            return true;
        }
      });
    }

    const term = search.trim().toLowerCase();
    if (term) {
      working = working.filter((t) => {
        const formattedId = `TKT-${t.id.slice(0, 3).toUpperCase()}`;
        return (
          formattedId.toLowerCase().includes(term) ||
          t.id.toLowerCase().includes(term) ||
          t.subject.toLowerCase().includes(term) ||
          t.requester.toLowerCase().includes(term) ||
          t.status.toLowerCase().includes(term) ||
          t.priority.toLowerCase().includes(term) ||
          (t.assigned?.toLowerCase().includes(term) ?? false)
        );
      });
    }

    if (fromDate || toDate) {
      working = working.filter((t) => isDateInRange(t.createdAtDate, fromDate, toDate));
    }

    return working;
  }, [tickets, filter, search, fromDate, toDate]);

  // Per user: deletable when status is Open or Resolved/Closed. Blocked
  // during Ongoing/Waiting so an in-flight ticket can't be removed.
  const canDeleteTicket = (t: Ticket) =>
    t.status === 'Open' || t.status === 'Resolved' || t.status === 'Closed';

  const handleSelectTicket = (ticket: Ticket) => openTicket(ticket.backendId);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        backgroundColor: 'background.default',
      }}
    >
      <PageHeader />

      <Box sx={{ px: 5, pb: 5, flexGrow: 1, overflowY: 'auto' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Staff Dashboard
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>
              Manage all your tickets
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 5 }}>
          <StaffStatsCardGrid
            submitted={stats.submitted}
            ongoing={stats.ongoing}
            open={stats.open}
            resolved={stats.resolved}
          />
        </Box>

        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <TicketFilterBar
            tabs={STAFF_FILTER_TABS}
            activeTab={filter}
            onChange={setFilter}
            hideSearch
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '10px',
                boxShadow: 'none',
                bgcolor: 'background.paper',
                minWidth: 240,
              }}
            >
              <SearchIcon />
              <InputBase
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ ml: 1, fontSize: 14, flex: 1 }}
              />
            </Paper>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setRaiseOpen(true)}
              sx={{
                textTransform: 'none',
                fontWeight: 500,
                borderRadius: '8px',
                px: 2.5,
                py: 0.9,
                boxShadow: 'none',
              }}
            >
              Raise a Ticket
            </Button>
            <DateRangeFilter
              start={fromDate}
              end={toDate}
              onChange={(start, end) => {
                setFromDate(start);
                setToDate(end);
              }}
            />
          </Box>
        </Box>

        <Box sx={{ minHeight: 0 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={32} sx={{ color: 'primary.main' }} />
            </Box>
          ) : error ? (
            <Box
              sx={{
                py: 4,
                px: 3,
                borderRadius: '12px',
                backgroundColor: 'error.light',
                border: '1px solid',
                borderColor: 'error.main',
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: 'error.main', fontSize: '14px', fontWeight: 500, mb: 1 }}>
                Could not load your tickets
              </Typography>
              <Typography sx={{ color: 'error.dark', fontSize: '13px' }}>
                {error}
              </Typography>
            </Box>
          ) : (
            <TicketTable
              tickets={filteredTickets}
              onSelect={handleSelectTicket}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              canDelete={canDeleteTicket}
            />
          )}
        </Box>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        slotProps={{
          paper: { sx: { borderRadius: '16px', p: 0, m: { xs: '16px', sm: '32px' }, width: { xs: '100%', sm: '360px' } } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary', pt: 3, px: 3, pb: 1 }}>
          Delete ticket {ticketToDelete ? `TKT-${ticketToDelete.id.slice(0, 3).toUpperCase()}` : ''}?
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <DialogContentText sx={{ color: 'text.secondary', fontSize: '14px' }}>
            This action cannot be undone.
          </DialogContentText>
          {deleteError && (
            <Typography sx={{ color: 'error.main', fontSize: '13px', mt: 2 }}>
              {deleteError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            onClick={handleCloseDelete}
            disabled={deleteLoading}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={deleteLoading}
            sx={{
              textTransform: 'none',
              backgroundColor: 'error.main',
              fontWeight: 500,
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'error.dark' },
            }}
          >
            {deleteLoading ? <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: { sx: { borderRadius: '16px', p: 0, m: { xs: '16px', sm: '32px' } } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '18px', color: 'text.primary', pt: 3, px: 3, pb: 1 }}>
          Edit ticket
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Subject"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              disabled={editLoading || departmentsLoading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth disabled={editLoading || departmentsLoading}>
                <Select
                  displayEmpty
                  value={editDepartmentId}
                  onChange={(e) => {
                    setEditDepartmentId(e.target.value);
                    setEditCategoryId('');
                  }}
                >
                  <MenuItem value="" disabled>
                    Select Department
                  </MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth disabled={editLoading || departmentsLoading || !editDepartmentId || filteredCategories.length === 0}>
                <Select
                  displayEmpty
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value)}
                >
                  <MenuItem value="" disabled>
                    {editDepartmentId ? 'Select Category' : 'Choose a department first'}
                  </MenuItem>
                  {filteredCategories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={editLoading || departmentsLoading}
            />
            <FormControl fullWidth disabled={editLoading || departmentsLoading}>
              <Select
                displayEmpty
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select Priority
                </MenuItem>
                {PRIORITY_OPTIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {editError && (
              <Typography sx={{ color: 'error.main', fontSize: '13px' }}>
                {editError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            onClick={handleCloseEdit}
            disabled={editLoading}
            sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmEdit}
            disabled={editLoading || departmentsLoading}
            sx={{
              textTransform: 'none',
              backgroundColor: 'primary.main',
              fontWeight: 500,
              borderRadius: '8px',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            {editLoading ? <CircularProgress size={18} sx={{ color: 'primary.contrastText' }} /> : 'Save changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <RaiseTicketModal
        open={raiseOpen}
        onClose={() => setRaiseOpen(false)}
        onSubmit={async (formData) => {
          try {
            const newTicket = await createTicketRequest(formData);
            // Post the typed description as the first chat message on the new
            // ticket. Backend doesn't auto-create an initial message, so this
            // keeps the chat thread consistent with the rest of the app.
            if (newTicket?.id && formData.description.trim()) {
              try {
                await sendTicketMessageRequest(
                  newTicket.id,
                  formData.description.trim(),
                  null,
                  false
                );
              } catch (msgErr) {
                // Don't fail the whole flow if the seed message fails — the
                // ticket itself was created successfully.
                console.warn('Failed to seed first ticket message:', msgErr);
              }
            }
            await refetch();
            if (newTicket?.id) notifyTicketChanged(newTicket.id);
            setRaiseOpen(false);
          } catch (err) {
            // Surface the error via the modal's own flow; keep the modal open so
            // the user can retry. The modal's internal submitting flag handles the
            // button spinner.
            throw err;
          }
        }}
      />
    </Box>
  );
}

function mapBackendTicket(ticket: TicketResponseDto): Ticket {
  const statusMap: Record<string, TicketStatus> = {
    Active: 'Open',
    Ongoing: 'Ongoing',
    Resolved: 'Resolved',
    Closed: 'Closed',
  };

  const formatDate = (value: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    return isNaN(date.getTime())
      ? value
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Defensive: backend sometimes returns null/empty for createdByName
  // despite the DTO contract. Use an id-derived label instead of a hardcoded
  // "Unknown".
  const trimmedName = (ticket.createdByName ?? '').trim();
  const requesterFallback = ticket.createdById
    ? `User ${ticket.createdById.slice(0, 6)}`
    : 'User';

  return {
    id: ticket.id.slice(0, 8).toUpperCase(),
    backendId: ticket.id,
    subject: ticket.title,
    department: ticket.departmentName || '—',
    departmentId: ticket.departmentId,
    category: ticket.categoryName || '—',
    categoryId: ticket.categoryId,
    description: ticket.description,
    attachmentUrl: ticket.attachmentUrl || null,
    priority: (ticket.priority as Ticket['priority']) || 'Medium',
    status: statusMap[ticket.status] || 'Waiting',
    requester: trimmedName || requesterFallback,
    requesterId: ticket.createdById,
    assigned: ticket.assignedAgentName || null,
    createdAt: formatDate(ticket.createdAt),
    createdAtDate: ticket.createdAt,
    updatedAt: formatDate(ticket.updatedAt),
    isRated: ticket.isRated,
  };
}

export default StaffDashboardPage;