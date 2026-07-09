import { useEffect, useState } from 'react';
import { getAverageRatingRequest, type AverageRatingDto } from '@/lib/api';

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

  useEffect(() => {
    if (!agentId) return;

    let cancelled = false;
    const fetchRating = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAverageRatingRequest(agentId);
        if (!cancelled) {
          setRating(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load rating');
          setRating(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRating();

    return () => {
      cancelled = true;
    };
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
