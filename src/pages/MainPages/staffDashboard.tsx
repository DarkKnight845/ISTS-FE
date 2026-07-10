import { useCallback, useEffect, useMemo, useState } from "react";
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
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import StatCard from "@/components/ui/Cards/StatCard";
import DashboardHeader from "@/components/ui/DahboardHeader";
import StaffToolbar from "@/components/ui/Toolbar";
import RaiseTicketModal from "@/components/ui/Modals/RaiseTicketModals";
import StaffNavbar from "@/components/ui/Nabvar/StaffNavbar";
import StaffTable from "@/components/ui/Tables/StaffTable";
import TicketDetailDrawer from "@/components/TicketDetailDrawer";
import {
  TicketSubmittedIcon,
  TicketInProgressIcon,
  TicketResolvedIcon,
  TicketUrgentIcon,
} from "@/components/icons";
import type { Ticket, TicketStatus } from "@/components/ui/types/ticket";
import { useMyTickets } from "@/hooks/useMyTickets";
import { useSignalR } from "@/hooks/useSignalR";
import { useAuth } from "@/context/AuthContext";
import type { TicketResponseDto, TicketMessageDto, NotificationDto, DepartmentDto } from "@/lib/api";
import {
  createTicketRequest,
  deleteTicketRequest,
  updateTicketRequest,
  getDepartmentsRequest,
} from "@/lib/api";
import type { TicketFormData } from "@/components/ui/Modals/RaiseTicketForm";

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

function StaffDashboardPage() {
  const { userId: currentUserId } = useAuth();
  const { tickets: backendTickets, loading, error, refetch } = useMyTickets();
  const [openModal, setOpenModal] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | "Open" | "Waiting" | "Resolved">("All");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<Ticket | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [departments, setDepartments] = useState<DepartmentDto[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (backendTickets) {
      setTickets(backendTickets.map(mapBackendTicket));
    }
  }, [backendTickets]);

  const handleNewMessage = useCallback((message: TicketMessageDto) => {
    if (selectedTicket?.backendId === message.ticketId) return;
    refetch();
  }, [refetch, selectedTicket?.backendId]);

  const handleNewNotification = useCallback((_notification: NotificationDto) => {
    // Notification handled by the notification system.
  }, []);

  const { connection } = useSignalR({
    onMessage: handleNewMessage,
    onNotification: handleNewNotification,
  });

  const stats = useMemo(() => {
    const submitted = tickets.length;
    const ongoing = tickets.filter((t) => t.status === "Ongoing").length;
    const open = tickets.filter((t) => t.status === "Open").length;
    const resolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
    return { submitted, ongoing, open, resolved };
  }, [tickets]);

  const handleCreateTicket = async (data: TicketFormData) => {
    await createTicketRequest({
      title: data.subject,
      description: data.description,
      priority: data.priority,
      departmentId: data.departmentId,
      categoryId: data.categoryId,
      attachment: data.attachment,
    });
    await refetch();
    setOpenModal(false);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedTicket(null), 250);
  };

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
      await deleteTicketRequest(ticketToDelete.backendId);
      await refetch();
      setDeleteDialogOpen(false);
      setTimeout(() => setTicketToDelete(null), 250);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete ticket");
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
      setEditError(err instanceof Error ? err.message : "Failed to load departments");
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
      setEditSubject("");
      setEditDescription("");
      setEditPriority("");
      setEditDepartmentId("");
      setEditCategoryId("");
      setEditError(null);
    }, 250);
  };

  const handleConfirmEdit = async () => {
    if (!ticketToEdit) return;

    if (!editSubject.trim()) {
      setEditError("Please enter a ticket subject.");
      return;
    }
    if (!editDepartmentId) {
      setEditError("Please select a department.");
      return;
    }
    if (!editCategoryId) {
      setEditError("Please select a category.");
      return;
    }
    if (!editDescription.trim()) {
      setEditError("Please describe your issue.");
      return;
    }
    if (!editPriority) {
      setEditError("Please select a priority.");
      return;
    }

    setEditLoading(true);
    setEditError(null);
    try {
      await updateTicketRequest(ticketToEdit.backendId, {
        title: editSubject.trim(),
        description: editDescription.trim(),
        priority: editPriority,
        departmentId: editDepartmentId,
        categoryId: editCategoryId,
      });
      await refetch();
      setEditDialogOpen(false);
      handleCloseEdit();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Failed to update ticket");
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
    const term = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      let matchesFilter = true;
      switch (filter) {
        case "Open":
          matchesFilter = ticket.status === "Open";
          break;
        case "Waiting":
          matchesFilter = ticket.status === "Ongoing" || ticket.status === "Waiting";
          break;
        case "Resolved":
          matchesFilter = ticket.status === "Resolved" || ticket.status === "Closed";
          break;
        default:
          matchesFilter = true;
      }

      const matchesSearch =
        !term ||
        ticket.subject.toLowerCase().includes(term) ||
        ticket.id.toLowerCase().includes(term) ||
        ticket.category.toLowerCase().includes(term);

      const matchesDate = isDateInRange(ticket.createdAtDate, fromDate, toDate);

      return matchesFilter && matchesSearch && matchesDate;
    });
  }, [tickets, filter, search, fromDate, toDate]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        backgroundColor: "background.default",
      }}
    >
      <StaffNavbar />

      <Box sx={{ px: 5, pb: 5, flexGrow: 1, overflowY: "auto" }}>
        <DashboardHeader
          start={fromDate}
          end={toDate}
          onDateChange={(start, end) => {
            setFromDate(start);
            setToDate(end);
          }}
        />

        <Box
          sx={{
            mb: 4,
            borderRadius: 2,
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            title="Submitted"
            value={stats.submitted}
            caption={`${stats.submitted} ticket${stats.submitted === 1 ? "" : "s"} you have raised`}
            icon={
              <Box
                sx={{
                  backgroundColor: "primary.main",
                  borderRadius: 2,
                  p: 1.3,
                }}
              >
                <TicketSubmittedIcon size={25} />
              </Box>
            }
          />

          <StatCard
            title="Ongoing"
            value={stats.ongoing}
            caption={`${stats.ongoing} ticket${stats.ongoing === 1 ? "" : "s"} being worked on`}
            icon={
              <Box
                sx={{
                  backgroundColor: "#FFE2C2",
                  borderRadius: 2,
                  p: 1.3,
                }}
              >
                <TicketInProgressIcon size={25} />
              </Box>
            }
          />

          <StatCard
            title="Open"
            value={stats.open}
            caption={`${stats.open} ticket${stats.open === 1 ? "" : "s"} awaiting action`}
            icon={
              <Box
                sx={{
                  backgroundColor: "#FFC2C2",
                  borderRadius: 2,
                  p: 1.3,
                }}
              >
                <TicketUrgentIcon size={25} />
              </Box>
            }
          />

          <StatCard
            title="Resolved"
            value={stats.resolved}
            caption={`${stats.resolved} ticket${stats.resolved === 1 ? "" : "s"} resolved`}
            icon={
              <Box
                sx={{
                  backgroundColor: "#C1E1CE",
                  borderRadius: 2,
                  p: 1.3,
                }}
              >
                <TicketResolvedIcon size={25} />
              </Box>
            }
          />
        </Box>

        <Box
          sx={{
            mb: 4,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <StaffToolbar
            activeFilter={filter}
            onFilterChange={setFilter}
            search={search}
            onSearchChange={setSearch}
            onRaiseTicket={() => setOpenModal(true)}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={32} sx={{ color: "primary.main" }} />
            </Box>
          ) : error ? (
            <Box
              sx={{
                py: 4,
                px: 3,
                borderRadius: "12px",
                backgroundColor: "error.light",
                border: "1px solid",
                borderColor: "error.main",
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "error.main", fontSize: "14px", fontWeight: 500, mb: 1 }}>
                Could not load your tickets
              </Typography>
              <Typography sx={{ color: "error.dark", fontSize: "13px" }}>
                {error}
              </Typography>
            </Box>
          ) : (
            <StaffTable
              tickets={filteredTickets}
              onRowClick={handleSelectTicket}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          )}
        </Box>
      </Box>

      <RaiseTicketModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreateTicket}
      />

      <TicketDetailDrawer
        ticket={selectedTicket}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        connection={connection}
        canAccept={false}
        currentUserId={currentUserId}
        onTicketUpdated={(updated) => {
          setSelectedTicket(updated);
          setTickets((prev) =>
            prev.map((t) => (t.backendId === updated.backendId ? updated : t))
          );
        }}
      />

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
                    setEditCategoryId("");
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
                    {editDepartmentId ? "Select Category" : "Choose a department first"}
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
    </Box>
  );
}



function mapBackendTicket(ticket: TicketResponseDto): Ticket {
  const statusMap: Record<string, TicketStatus> = {
    Active: "Open",
    Ongoing: "Ongoing",
    Resolved: "Resolved",
    Closed: "Closed",
  };

  const formatDate = (value: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    return isNaN(date.getTime())
      ? value
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return {
    id: ticket.id.slice(0, 8).toUpperCase(),
    backendId: ticket.id,
    subject: ticket.title,
    department: ticket.departmentName || "—",
    departmentId: ticket.departmentId,
    category: ticket.categoryName || "—",
    categoryId: ticket.categoryId,
    description: ticket.description,
    attachmentUrl: ticket.attachmentUrl || null,
    priority: (ticket.priority as Ticket["priority"]) || "Medium",
    status: statusMap[ticket.status] || "Waiting",
    requester: ticket.createdByName || "You",
    requesterId: ticket.createdById,
    assigned: ticket.assignedAgentName || null,
    createdAt: formatDate(ticket.createdAt),
    createdAtDate: ticket.createdAt,
    updatedAt: formatDate(ticket.updatedAt),
    isRated: ticket.isRated,
  };
}

export default StaffDashboardPage;
