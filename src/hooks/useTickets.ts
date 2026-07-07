import { useEffect, useState } from 'react';
import { getTicketsRequest } from '@/lib/api';

export interface BackendTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  createdById: string;
  createdByName: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string | null;
  slaDueAt: string | null;
  isBreached: boolean;
  overdueBy: string | null;
}

interface UseTicketsResult {
  tickets: BackendTicket[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTickets(): UseTicketsResult {
  const [tickets, setTickets] = useState<BackendTicket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketsRequest();
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
  }, []);

  return { tickets, loading, error, refetch: fetchTickets };
}
