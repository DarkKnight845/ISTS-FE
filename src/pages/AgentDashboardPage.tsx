import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Header from '../components/Header';
import StatsCardGrid from '../components/StatsCardGrid';
import TicketFilterBar from '../components/TicketFilterBar';
import TicketTable from '../components/TicketTable';
import TicketDetailDrawer from '../components/TicketDetailDrawer';
import { type Ticket } from '../data/mockTickets';
import { useAssignedTickets } from '@/hooks/useAssignedTickets';
import { useOpenTickets } from '@/hooks/useOpenTickets';
import { useSignalR } from '@/hooks/useSignalR';
import { useAuth } from '@/context/AuthContext';
import type { TicketResponseDto, TicketMessageDto, NotificationDto } from '@/lib/api';
import { CalendarIcon } from '@/components/icons';

type FilterTab = 'All' | 'Mine' | 'Unassigned';

/**
 * Agent dashboard content rendered inside DashboardLayout.
 */
function AgentDashboardPage() {
  const { userId: currentUserId } = useAuth();
  const {
    tickets: assignedTickets,
    loading: assignedLoading,
    error: assignedError,
    refetch: refetchAssigned,
  } = useAssignedTickets();
  const {
    tickets: openTickets,
    loading: openLoading,
    error: openError,
    refetch: refetchOpen,
  } = useOpenTickets();

  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [unassignedTickets, setUnassignedTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (assignedTickets) {
      setMyTickets(assignedTickets.map(mapBackendTicket));
    }
  }, [assignedTickets]);

  useEffect(() => {
    if (openTickets) {
      setUnassignedTickets(openTickets.map(mapBackendTicket));
    }
  }, [openTickets]);

  const handleNewMessage = useCallback((message: TicketMessageDto) => {
    // Refresh lists when a new message arrives so counts stay current.
    if (selectedTicket?.backendId === message.ticketId) return;
    refetchAssigned();
    refetchOpen();
  }, [refetchAssigned, refetchOpen, selectedTicket?.backendId]);

  const handleNewNotification = useCallback((_notification: NotificationDto) => {
    // Notification handled by the notification system.
  }, []);

  const { connection } = useSignalR({
    onMessage: handleNewMessage,
    onNotification: handleNewNotification,
  });

  const filteredTickets = useMemo(() => {
    switch (activeTab) {
      case 'Mine':
        return myTickets;
      case 'Unassigned':
        return unassignedTickets;
      default:
        return [...unassignedTickets, ...myTickets];
    }
  }, [activeTab, myTickets, unassignedTickets]);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedTicket(null), 250);
  };

  const handleTicketUpdated = (updatedTicket: Ticket) => {
    setSelectedTicket(updatedTicket);
    refetchAssigned();
    refetchOpen();
  };

  return (
    <>
      <Header />

      <Box sx={{ p: 4, flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 500, color: 'text.primary' }}>
            Agent Dashboard
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              backgroundColor: 'background.paper',
              color: 'text.secondary',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            <CalendarIcon size={16} color="currentColor" />
            Apr 1 - Apr 7, 2026
          </Box>
        </Box>

        <Box sx={{ mb: 5 }}>
          <StatsCardGrid
            assignedToMe={myTickets.length}
            resolved={myTickets.filter((t) => t.status === 'Resolved').length}
            unassigned={unassignedTickets.length}
          />
        </Box>

        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <TicketFilterBar activeTab={activeTab} onChange={setActiveTab} />
        </Box>

        <Box sx={{ minHeight: 0 }}>
          {assignedLoading || openLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={32} sx={{ color: 'primary.main' }} />
            </Box>
          ) : assignedError || openError ? (
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
                Could not load tickets
              </Typography>
              <Typography sx={{ color: 'error.dark', fontSize: '13px' }}>
                {assignedError || openError}
              </Typography>
            </Box>
          ) : (
            <TicketTable tickets={filteredTickets} onSelect={handleSelectTicket} />
          )}
        </Box>
      </Box>

      <TicketDetailDrawer
        ticket={selectedTicket}
        open={drawerOpen}
        onClose={handleCloseDrawer}
        connection={connection}
        onTicketUpdated={handleTicketUpdated}
        currentUserId={currentUserId}
      />
    </>
  );
}

function mapBackendTicket(ticket: TicketResponseDto): Ticket {
  const statusMap: Record<string, Ticket['status']> = {
    Active: 'Active',
    Ongoing: 'Ongoing',
    Resolved: 'Resolved',
    Closed: 'Closed',
  };

  const priorityMap: Record<string, Ticket['priority']> = {
    Urgent: 'Urgent',
    High: 'High',
    Medium: 'Medium',
    Low: 'Low',
  };

  const formatDate = (value: string | null) => {
    if (!value) return '—';
    const date = new Date(value);
    return isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return {
    id: ticket.id.slice(0, 8).toUpperCase(),
    backendId: ticket.id,
    subject: ticket.title,
    requester: ticket.createdByName || 'Unknown',
    status: statusMap[ticket.status] || 'Active',
    priority: priorityMap[ticket.priority] || 'Medium',
    assigned: ticket.assignedAgentName || null,
    updatedAt: ticket.isBreached && ticket.overdueBy ? `Overdue by ${ticket.overdueBy}` : formatDate(ticket.updatedAt),
    createdAt: formatDate(ticket.createdAt),
    messages: [],
  };
}

export default AgentDashboardPage;
