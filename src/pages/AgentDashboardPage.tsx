import { useCallback, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Header from '../components/Header';
import StatsCardGrid from '../components/StatsCardGrid';
import TicketFilterBar from '../components/TicketFilterBar';
import TicketTable from '../components/TicketTable';
import DateRangeFilter from '../components/DateRangeFilter';
import type { Ticket } from '@/components/ui/types/ticket';
import { useAssignedTickets } from '@/hooks/useAssignedTickets';
import { useOpenTickets } from '@/hooks/useOpenTickets';
import { useAverageRating } from '@/hooks/useAverageRating';
import { useSignalR } from '@/hooks/useSignalR';
import { formatTicketDate } from '@/lib/format';
import { useAuth } from '@/context/AuthContext';
import { useTicketDrawer } from '@/context/TicketDrawerContext';
import type { TicketResponseDto, TicketMessageDto } from '@/lib/api';

type FilterTab = 'All' | 'Mine' | 'Unassigned';

const FILTER_TABS: readonly FilterTab[] = ['All', 'Mine', 'Unassigned'];

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
  const { rating: averageRating, loading: ratingLoading } = useAverageRating(currentUserId);

  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { openTicket } = useTicketDrawer();

  const myTickets = useMemo(() => assignedTickets?.map(mapBackendTicket) ?? [], [assignedTickets]);
  const unassignedTickets = useMemo(() => openTickets?.map(mapBackendTicket) ?? [], [openTickets]);

  const handleNewMessage = useCallback((message: TicketMessageDto) => {
    // The drawer subscribes to its own ticket group, so messages for the
    // currently-open ticket arrive in the drawer directly. Here we just
    // refresh the lists so counts / status stay current.
    if (message.ticketId) {
      refetchAssigned();
      refetchOpen();
    }
  }, [refetchAssigned, refetchOpen]);

  const handleNewNotification = useCallback(
    (notification: { ticketId?: string | null }) => {
      // Notification tied to a ticket usually means another user (or system)
      // changed it (e.g. new ticket raised, escalated, reassigned). Refresh
      // both lists so counts stay accurate without a manual reload.
      if (notification.ticketId) {
        refetchAssigned();
        refetchOpen();
      }
    },
    [refetchAssigned, refetchOpen]
  );

  // Page-level listener for cross-ticket updates. The connection itself
  // is owned by TicketDrawerHost at the layout level.
  useSignalR({
    onMessage: handleNewMessage,
    onNotification: handleNewNotification,
  });

  const filteredTickets = useMemo(() => {
    let tickets: Ticket[];
    switch (activeTab) {
      case 'Mine':
        tickets = myTickets;
        break;
      case 'Unassigned':
        tickets = unassignedTickets;
        break;
      default:
        tickets = [...unassignedTickets, ...myTickets];
    }

    const term = search.trim().toLowerCase();
    if (term) {
      tickets = tickets.filter((t) => {
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
      tickets = tickets.filter((t) => isDateInRange(t.createdAtDate, fromDate, toDate));
    }

    return tickets;
  }, [activeTab, myTickets, unassignedTickets, search, fromDate, toDate]);

  const handleSelectTicket = (ticket: Ticket) => {
    openTicket(ticket.backendId);
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
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Agent Dashboard
            </Typography>
            <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '14px' }}>
              Manage assigned tickets and pick up open requests.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 5 }}>
          <StatsCardGrid
            assignedToMe={myTickets.length}
            resolved={myTickets.filter((t) => t.status === 'Resolved').length}
            unassigned={unassignedTickets.length}
            averageRating={averageRating?.averageRating ?? null}
            totalRatings={averageRating?.totalRatings ?? 0}
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
          <TicketFilterBar
            tabs={FILTER_TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            search={search}
            onSearchChange={setSearch}
            dateFilter={
              <DateRangeFilter
                start={fromDate}
                end={toDate}
                onChange={(start, end) => {
                  setFromDate(start);
                  setToDate(end);
                }}
              />
            }
          />
        </Box>

        <Box sx={{ minHeight: 0 }}>
          {assignedLoading || openLoading || ratingLoading ? (
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
    </>
  );
}

function mapBackendTicket(ticket: TicketResponseDto): Ticket {
  const statusMap: Record<string, Ticket['status']> = {
    Active: 'Open',
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

  const formatDate = (value: string | null) => formatTicketDate(value);

  // Defensive: backend sometimes returns null/empty for createdByName
  // despite the DTO contract. Use an id-derived label instead of "Unknown".
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
    requester: trimmedName || requesterFallback,
    requesterId: ticket.createdById,
    status: statusMap[ticket.status] || 'Open',
    priority: priorityMap[ticket.priority] || 'Medium',
    assigned: ticket.assignedAgentName || null,
    updatedAt: ticket.isBreached && ticket.overdueBy ? `Overdue by ${ticket.overdueBy}` : formatDate(ticket.updatedAt),
    createdAt: formatDate(ticket.createdAt),
    createdAtDate: ticket.createdAt,
    description: ticket.description,
    isRated: ticket.isRated,
    attachmentUrl: ticket.attachmentUrl || null,
  };
}

export default AgentDashboardPage;
