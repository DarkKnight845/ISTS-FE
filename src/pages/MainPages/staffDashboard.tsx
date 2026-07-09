import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
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
import type { TicketResponseDto, TicketMessageDto, NotificationDto } from "@/lib/api";
import { createTicketRequest } from "@/lib/api";
import type { TicketFormData } from "@/components/ui/Modals/RaiseTicketForm";

function StaffDashboardPage() {
  const { userId: currentUserId } = useAuth();
  const { tickets: backendTickets, loading, error, refetch } = useMyTickets();
  const [openModal, setOpenModal] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | "Ongoing" | "Waiting" | "Completed">("All");
  const [search, setSearch] = useState("");

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
    const inProgress = tickets.filter((t) => t.status === "InProgress").length;
    const waiting = tickets.filter((t) => t.status === "Open" || t.status === "Waiting").length;
    const resolved = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length;
    return { submitted, inProgress, waiting, resolved };
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

  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      let matchesFilter = true;
      switch (filter) {
        case "Ongoing":
          matchesFilter = ticket.status === "InProgress";
          break;
        case "Waiting":
          matchesFilter = ticket.status === "Open" || ticket.status === "Waiting";
          break;
        case "Completed":
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

      return matchesFilter && matchesSearch;
    });
  }, [tickets, filter, search]);

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
        <DashboardHeader />

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
            title="In Progress"
            value={stats.inProgress}
            caption={`${stats.inProgress} ticket${stats.inProgress === 1 ? "" : "s"} being worked on`}
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
            title="Waiting on you"
            value={stats.waiting}
            caption={`${stats.waiting} ticket${stats.waiting === 1 ? "" : "s"} awaiting action`}
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
            <StaffTable tickets={filteredTickets} onRowClick={handleSelectTicket} />
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
    </Box>
  );
}



function mapBackendTicket(ticket: TicketResponseDto): Ticket {
  const statusMap: Record<string, TicketStatus> = {
    Active: "Open",
    Ongoing: "InProgress",
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
    category: ticket.categoryName || "—",
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
