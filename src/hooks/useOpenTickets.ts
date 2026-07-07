import { useEffect, useState } from 'react';
import { getTicketsRequest, type TicketResponseDto } from '@/lib/api';

interface UseOpenTicketsResult {
  tickets: TicketResponseDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOpenTickets(): UseOpenTicketsResult {
  const [tickets, setTickets] = useState<TicketResponseDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketsRequest({ status: 'Open' });
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load open tickets');
      setTickets(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return { tickets, loading, error, refetch: fetchTickets };
}
