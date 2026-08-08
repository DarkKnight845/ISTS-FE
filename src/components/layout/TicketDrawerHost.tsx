import { useEffect, useState, useCallback } from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import TicketDetailDrawer from '@/components/TicketDetailDrawer';
import { useTicketDrawer } from '@/context/TicketDrawerContext';
import { useTicketSync } from '@/context/TicketSyncContext';
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

  // The DTO types createdByName as non-null, but the wire sometimes returns
  // an empty string or null. Treat both as missing and fall back to a short
  // id-derived label rather than "Unknown", which reads as an error.
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

/**
 * Renders the ticket detail drawer over the dashboard when an id is set
 * in TicketDrawerContext. Mounted once at the layout level.
 */
function TicketDrawerHost() {
  const { openTicketId, closeTicket } = useTicketDrawer();
  const { subscribe: subscribeToTicketChanges } = useTicketSync();
  const { userId, role } = useAuth();
  const { connection, notificationConnection } = useSignalR();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pull the latest server snapshot for the open ticket. Used on mount and
  // whenever a SignalR event indicates the ticket changed (message arrival,
  // notification, etc.).
  const refetchTicket = useCallback(async (id: string) => {
    try {
      const data = await getTicketByIdRequest(id);
      setTicket(mapBackendTicket(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket');
    }
  }, []);

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

  // Refresh the open ticket when cross-session events arrive for it.
  // SignalR doesn't have a dedicated "ticket updated" event, so we piggyback
  // on incoming messages and notifications — either signals someone else
  // touched the ticket.
  useEffect(() => {
    if (!openTicketId) return;

    const onMessage = (message: { ticketId?: string }) => {
      if (message.ticketId === openTicketId) refetchTicket(openTicketId);
    };
    const onNotification = (notification: { ticketId?: string | null }) => {
      if (notification.ticketId === openTicketId) refetchTicket(openTicketId);
    };

    if (connection) connection.on('ReceiveMessage', onMessage);
    if (notificationConnection) notificationConnection.on('Notification', onNotification);

    return () => {
      if (connection) connection.off('ReceiveMessage', onMessage);
      if (notificationConnection) notificationConnection.off('Notification', onNotification);
    };
  }, [connection, notificationConnection, openTicketId, refetchTicket]);

  // Subscribe to the cross-page ticket sync bus. Whenever any page refetches
  // its ticket list (after create/edit/delete or a SignalR push), it
  // notifies the bus. We refetch the open ticket if the bus event matches
  // its id (or is a global null). This is the primary real-time path.
  useEffect(() => {
    if (!openTicketId) return;
    const unsubscribe = subscribeToTicketChanges((changedId) => {
      if (!changedId || changedId === openTicketId) {
        refetchTicket(openTicketId);
      }
    });
    return unsubscribe;
  }, [openTicketId, refetchTicket, subscribeToTicketChanges]);

  // Tight safety-net poll. The bus covers SignalR-driven refreshes; the
  // poll covers the case where the backend mutated a ticket and didn't
  // emit anything to us (e.g. agent accepted, no message sent, no
  // notification routed). 3s is short enough to feel real-time and
  // cheap enough not to thrash.
  useEffect(() => {
    if (!openTicketId) return;
    const interval = setInterval(() => {
      refetchTicket(openTicketId);
    }, 3000);
    return () => clearInterval(interval);
  }, [openTicketId, refetchTicket]);

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