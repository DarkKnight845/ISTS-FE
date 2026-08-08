import { useEffect, useState } from 'react';
import { getTicketsRequest, type GetTicketsFilters, type TicketResponseDto } from '@/lib/api';

export interface BackendTicket extends TicketResponseDto {}

interface UseTicketsResult {
  tickets: BackendTicket[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTickets(filters?: GetTicketsFilters): UseTicketsResult {
  const [tickets, setTickets] = useState<BackendTicket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketsRequest(filters);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      setTickets(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(() => {
      fetchTickets();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { tickets, loading, error, refetch: fetchTickets };
}
