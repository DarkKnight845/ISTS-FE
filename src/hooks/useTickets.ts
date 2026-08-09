import { useCallback, useEffect, useState } from 'react';
import { getTicketsRequest, type GetTicketsFilters, type TicketResponseDto } from '@/lib/api';

export interface BackendTicket extends TicketResponseDto {}

interface UseTicketsResult {
  tickets: BackendTicket[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const TICKET_POLL_INTERVAL_MS = 5000;

export function useTickets(filters?: GetTicketsFilters): UseTicketsResult {
  const [tickets, setTickets] = useState<BackendTicket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = JSON.stringify(filters);

  const fetchTickets = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getTicketsRequest(filters);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      setTickets(null);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchTickets(false);
    const interval = setInterval(() => {
      fetchTickets(true);
    }, TICKET_POLL_INTERVAL_MS);

    const handleFocus = () => {
      fetchTickets(true);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchTickets]);

  return { tickets, loading, error, refetch: () => fetchTickets(false) };
}
