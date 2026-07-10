import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import TicketDetailDrawer from "@/components/TicketDetailDrawer";
import { useAuth, getDashboardPath } from "@/context/AuthContext";
import { useSignalR } from "@/hooks/useSignalR";
import { getTicketByIdRequest, type TicketResponseDto } from "@/lib/api";
import type { Ticket, TicketStatus } from "@/components/ui/types/ticket";

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
    requester: ticket.createdByName || "Unknown",
    requesterId: ticket.createdById,
    assigned: ticket.assignedAgentName || null,
    createdAt: formatDate(ticket.createdAt),
    createdAtDate: ticket.createdAt,
    updatedAt: formatDate(ticket.updatedAt),
    isRated: ticket.isRated,
  };
}

function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { role, userId } = useAuth();
  const { connection } = useSignalR();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canAccept = role === "agent";
  const homePath = useMemo(() => (role ? getDashboardPath(role) : "/login"), [role]);

  useEffect(() => {
    if (!ticketId) {
      setError("No ticket selected.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getTicketByIdRequest(ticketId)
      .then((data) => {
        if (!cancelled) setTicket(mapBackendTicket(data));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load ticket");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ticketId]);

  const handleClose = () => {
    navigate(homePath, { replace: true });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={32} sx={{ color: "primary.main" }} />
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          px: 3,
          gap: 2,
        }}
      >
        <Typography sx={{ color: "error.main", fontWeight: 500 }}>
          {error || "Ticket not found."}
        </Typography>
        <Button variant="contained" onClick={handleClose} sx={{ textTransform: "none" }}>
          Go back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "background.default" }}>
      <TicketDetailDrawer
        ticket={ticket}
        open
        onClose={handleClose}
        connection={connection}
        canAccept={canAccept}
        currentUserId={userId}
        onTicketUpdated={(updated) => setTicket(updated)}
      />
    </Box>
  );
}

export default TicketDetailPage;
