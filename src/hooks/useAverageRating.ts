import { useEffect, useState } from 'react';
import { getAverageRatingRequest, type AverageRatingDto } from '@/lib/api';
import { useTicketSync } from '@/context/TicketSyncContext';

interface UseAverageRatingResult {
  rating: AverageRatingDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAverageRating(agentId: string | null): UseAverageRatingResult {
  const [rating, setRating] = useState<AverageRatingDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const { subscribe: subscribeToTicketChanges } = useTicketSync();

  const fetchRating = async (cancelledRef: { current: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAverageRatingRequest(agentId);
      if (!cancelledRef.current) {
        setRating(data);
      }
    } catch (err) {
      if (!cancelledRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to load rating');
        setRating(null);
      }
    } finally {
      if (!cancelledRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!agentId) return;

    const cancelledRef = { current: false };
    fetchRating(cancelledRef);

    // Refresh the rating when any ticket changes (e.g. a new rating submitted).
    const unsubscribe = subscribeToTicketChanges(() => {
      fetchRating(cancelledRef);
    });

    return () => {
      cancelledRef.current = true;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, tick]);

  if (!agentId) {
    return { rating: null, loading: false, error: null, refetch: () => {} };
  }

  return {
    rating,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
