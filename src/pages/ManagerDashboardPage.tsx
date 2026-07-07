import { useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import Header from '@/components/manager/Header';
import StatsGrid from '@/components/manager/StatsGrid';
import FilterBar from '@/components/manager/FilterBar';
import TicketTable from '@/components/manager/TicketTable';
import TicketDetailDrawer from '@/components/manager/TicketDetailDrawer';
import ReassignModal from '@/components/manager/ReassignModal';
import ReassignSuccessModal from '@/components/manager/ReassignSuccessModal';
import SlaBreachesModal from '@/components/manager/SlaBreachesModal';
import { type ManagerTicket } from '@/data/mockManagerTickets';
import { useTickets, type BackendTicket } from '@/hooks/useTickets';
import { getAgentsRequest, assignTicketRequest, type AgentDto } from '@/lib/api';

import { CalendarIcon } from '@/components/icons';

function ManagerDashboardPage() {
  const { tickets: backendTickets, loading: ticketsLoading, error: ticketsError, refetch } = useTickets();
  const [tickets, setTickets] = useState<ManagerTicket[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [assignedTo, setAssignedTo] = useState('All');

  const [selectedTicket, setSelectedTicket] = useState<ManagerTicket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [reassignOpen, setReassignOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successAgentName, setSuccessAgentName] = useState('');

  const [slaOpen, setSlaOpen] = useState(false);

  const [agents, setAgents] = useState<AgentDto[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(false);
  const [agentsError, setAgentsError] = useState<string | null>(null);
  const [reassignLoading, setReassignLoading] = useState(false);

  useEffect(() => {
    if (backendTickets) {
      setTickets(backendTickets.map(mapBackendTicket));
    }
  }, [backendTickets]);

  useEffect(() => {
    if (!reassignOpen) {
      setAgents([]);
      setAgentsError(null);
      return;
    }

    let cancelled = false;
    setAgentsLoading(true);
    setAgentsError(null);

    getAgentsRequest()
      .then((data) => {
        if (!cancelled) setAgents(data);
      })
      .catch((err) => {
        if (!cancelled) setAgentsError(err instanceof Error ? err.message : 'Failed to load agents');
      })
      .finally(() => {
        if (!cancelled) setAgentsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [reassignOpen]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        search === '' ||
        ticket.id.toLowerCase().includes(search.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        (ticket.assigned && ticket.assigned.toLowerCase().includes(search.toLowerCase()));

      const matchesStatus = status === 'All' || ticket.status === status;
      const matchesPriority = priority === 'All' || ticket.priority === priority;
      const matchesAssigned = assignedTo === 'All' || ticket.assigned === assignedTo;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssigned;
    });
  }, [tickets, search, status, priority, assignedTo]);

  const handleSelectTicket = (ticket: ManagerTicket) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedTicket(null), 250);
  };

  const handleOpenReassign = () => {
    setDrawerOpen(false);
    setReassignOpen(true);
  };

  const handleReassign = async (agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent || !selectedTicket) return;

    setReassignLoading(true);
    try {
      await assignTicketRequest(selectedTicket.backendId, agentId);
      await refetch();
      setReassignOpen(false);
      setSuccessAgentName(agent.fullName);
      setSuccessOpen(true);
    } catch (err) {
      setAgentsError(err instanceof Error ? err.message : 'Reassignment failed');
    } finally {
      setReassignLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setTimeout(() => setSuccessAgentName(''), 250);
  };

  const handleSlaRowClick = (ticket: ManagerTicket) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
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
            Manager Dashboard
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
          <StatsGrid onSlaClick={() => setSlaOpen(true)} />
        </Box>

        <Box
          sx={{
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            mb: 3,
          }}
        >
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            priority={priority}
            onPriorityChange={setPriority}
            assignedTo={assignedTo}
            onAssignedChange={setAssignedTo}
            onClear={() => {
              setSearch('');
              setStatus('All');
              setPriority('All');
              setAssignedTo('All');
            }}
          />
        </Box>

        <Box sx={{ minHeight: 0 }}>
          {ticketsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={32} sx={{ color: 'primary.main' }} />
            </Box>
          ) : ticketsError ? (
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
                Could not load tickets from backend
              </Typography>
              <Typography sx={{ color: 'error.dark', fontSize: '13px' }}>
                {ticketsError}
              </Typography>
            </Box>
          ) : (
            <TicketTable tickets={filteredTickets} onRowClick={handleSelectTicket} />
          )}
        </Box>
      </Box>

      <TicketDetailDrawer
        open={drawerOpen}
        ticket={selectedTicket}
        onClose={handleCloseDrawer}
        onReassign={handleOpenReassign}
      />

      {agentsError && reassignOpen && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1400,
            px: 3,
            py: 1.5,
            borderRadius: '8px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {agentsError}
        </Box>
      )}

      <ReassignModal
        open={reassignOpen}
        onClose={() => setReassignOpen(false)}
        onReassign={handleReassign}
        agents={agents}
        ticketId={selectedTicket?.id || ''}
        loading={agentsLoading || reassignLoading}
      />

      <ReassignSuccessModal
        open={successOpen}
        onClose={handleCloseSuccess}
        ticketId={selectedTicket?.id || ''}
        agentName={successAgentName}
      />

      <SlaBreachesModal
        open={slaOpen}
        onClose={() => setSlaOpen(false)}
        tickets={tickets}
        onRowClick={handleSlaRowClick}
      />
    </>
  );
}

function mapBackendTicket(ticket: BackendTicket): ManagerTicket {
  const statusMap: Record<string, ManagerTicket['status']> = {
    Active: 'Active',
    Ongoing: 'Ongoing',
    Resolved: 'Resolved',
    Closed: 'Resolved',
  };

  const priorityMap: Record<string, ManagerTicket['priority']> = {
    Urgent: 'Urgent',
    High: 'High',
    Medium: 'Medium',
    Low: 'Low',
  };

  const createdDate = new Date(ticket.createdAt);
  const updatedDate = ticket.updatedAt ? new Date(ticket.updatedAt) : createdDate;
  const formatDate = (date: Date) =>
    isNaN(date.getTime())
      ? ticket.createdAt
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const requester = ticket.createdByName || 'Unknown';
  const requesterInitials = requester
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return {
    id: ticket.id.slice(0, 8).toUpperCase(),
    backendId: ticket.id,
    subject: ticket.title,
    requester,
    requesterInitials,
    status: statusMap[ticket.status] || 'Active',
    priority: priorityMap[ticket.priority] || 'Medium',
    assigned: ticket.assignedAgentName || null,
    updatedAt: ticket.isBreached && ticket.overdueBy ? `Overdue by ${ticket.overdueBy}` : formatDate(updatedDate),
    createdAt: formatDate(createdDate),
    description: ticket.description,
    isBreach: ticket.isBreached,
    overdueBy: ticket.overdueBy || undefined,
  };
}

export default ManagerDashboardPage;
