import { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import TicketDetailDrawer from '@/components/TicketDetailDrawer';
import { useTicketDrawer } from '@/context/TicketDrawerContext';
import { useAuth } from '@/context/AuthContext';
import { useSignalR } from '@/hooks/useSignalR';
import { getTicketByIdRequest, type TicketResponseDto } from '@/lib/api';
import type { Ticket, TicketStatus } from '@/components/ui/types/ticket';

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
    requester: ticket.createdByName || 'Unknown',
    requesterId: ticket.createdById,
    assigned: ticket.assignedAgentName || null,
    createdAt: formatDate(ticket.createdAt),
    createdAtDate: ticket.createdAt,
    updatedAt: formatDate(ticket.updatedAt),
    isRated: ticket.isRated,
  };
}

/**
 * Renders the ticket detail drawer over the dashboard when an id is set
 * in TicketDrawerContext. Mounted once at the layout level.
 */
function TicketDrawerHost() {
  const { openTicketId, closeTicket } = useTicketDrawer();
  const { userId, role } = useAuth();
  const { connection } = useSignalR();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!openTicketId) {
      setTicket(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getTicketByIdRequest(openTicketId)
      .then((data) => {
        if (!cancelled) setTicket(mapBackendTicket(data));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load ticket');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [openTicketId]);

  if (!openTicketId) return null;

  if (loading) {
    return (
      <Box sx={{ position: 'fixed', top: 0, right: 0, width: { xs: '100%', sm: 420 }, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.paper', zIndex: 1300 }}>
        <CircularProgress size={32} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box sx={{ position: 'fixed', top: 0, right: 0, width: { xs: '100%', sm: 420 }, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.paper', zIndex: 1300, gap: 2, p: 3 }}>
        <Typography sx={{ color: 'error.main', fontWeight: 500 }}>
          {error || 'Ticket not found.'}
        </Typography>
        <Button variant="contained" onClick={closeTicket} sx={{ textTransform: 'none' }}>
          Close
        </Button>
      </Box>
    );
  }

  // Only agents can accept (assign themselves to) a ticket.
  const canAccept = role === 'agent';

  return (
    <TicketDetailDrawer
      ticket={ticket}
      open
      onClose={closeTicket}
      connection={connection}
      canAccept={canAccept}
      currentUserId={userId}
      onTicketUpdated={(updated) => setTicket(updated)}
    />
  );
}

export default TicketDrawerHost;