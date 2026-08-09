import { useCallback, useEffect, useState } from 'react';
import { getAssignedTicketsRequest, type TicketResponseDto } from '@/lib/api';

interface UseAssignedTicketsResult {
  tickets: TicketResponseDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const TICKET_POLL_INTERVAL_MS = 5000;

export function useAssignedTickets(): UseAssignedTicketsResult {
  const [tickets, setTickets] = useState<TicketResponseDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getAssignedTicketsRequest();
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assigned tickets');
      setTickets(null);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

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

  return { tickets, loading, error, refetch: fetchTickets };
}
