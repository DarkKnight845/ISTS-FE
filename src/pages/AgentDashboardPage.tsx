import { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCardGrid from '../components/StatsCardGrid';
import TicketFilterBar from '../components/TicketFilterBar';
import TicketTable from '../components/TicketTable';
import TicketDetailDrawer from '../components/TicketDetailDrawer';
import { mockTickets, type Ticket } from '../data/mockTickets';

type FilterTab = 'All' | 'Mine' | 'Unassigned';

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="2" stroke="#64748B" strokeWidth="1.5" fill="none" />
    <path d="M16 2V6M8 2V6M3 10H21" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/**
 * Main agent dashboard shell integrating sidebar, header, stats, filters, table, and drawer.
 */
function AgentDashboardPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredTickets = useMemo(() => {
    switch (activeTab) {
      case 'Mine':
        return mockTickets.filter((t) => t.assigned === 'Me' || t.assigned === 'Chisom Mabuchi');
      case 'Unassigned':
        return mockTickets.filter((t) => !t.assigned);
      default:
        return mockTickets;
    }
  }, [activeTab]);

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedTicket(null), 250);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
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
            <Typography variant="h4" sx={{ fontWeight: 500, color: '#111827' }}>
              Agent Dashboard
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                border: '1px solid #D1D5DB',
                borderRadius: '10px',
                backgroundColor: '#fff',
                color: '#374151',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              <CalendarIcon />
              Apr 1 - Apr 7, 2026
            </Box>
          </Box>

          <Box sx={{ mb: 5 }}>
            <StatsCardGrid />
          </Box>

          <Box
            sx={{
              pt: 4,
              borderTop: '1px solid #E5E7EB',
              mb: 3,
            }}
          >
            <TicketFilterBar activeTab={activeTab} onChange={setActiveTab} />
          </Box>

          <Box sx={{ minHeight: 0 }}>
            <TicketTable tickets={filteredTickets} onSelect={handleSelectTicket} />
          </Box>
        </Box>
      </Box>

      <TicketDetailDrawer
        ticket={selectedTicket}
        open={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </Box>
  );
}

export default AgentDashboardPage;
