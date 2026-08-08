import { useEffect, useState } from 'react';
import { getTicketAnalyticsRequest, type TicketAnalyticsDto } from '@/lib/api';

interface AnalyticsFilters {
  fromDate?: string;
  toDate?: string;
}

interface UseTicketAnalyticsResult {
  analytics: TicketAnalyticsDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTicketAnalytics(filters?: AnalyticsFilters): UseTicketAnalyticsResult {
  const [analytics, setAnalytics] = useState<TicketAnalyticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTicketAnalyticsRequest(filters);
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
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 15000);
    return () => clearInterval(interval);
  }, [filters?.fromDate, filters?.toDate]);

  return { analytics, loading, error, refetch: fetchAnalytics };
}
