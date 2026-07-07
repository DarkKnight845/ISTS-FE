import { useEffect, useState } from 'react';
import { getTicketAnalyticsRequest, type TicketAnalyticsDto } from '@/lib/api';

interface UseTicketAnalyticsResult {
  analytics: TicketAnalyticsDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTicketAnalytics(): UseTicketAnalyticsResult {
  const [analytics, setAnalytics] = useState<TicketAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketAnalyticsRequest();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, error, refetch: fetchAnalytics };
}
