import { useEffect, useState } from 'react';
import { getCurrentUserRequest, type CurrentUserDto } from '@/lib/api';

interface UseCurrentUserResult {
  user: CurrentUserDto | null;
  loading: boolean;
  error: string | null;
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<CurrentUserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      try {
        setLoading(true);
        const data = await getCurrentUserRequest();
        if (!cancelled) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load user');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, []);

  return { user, loading, error };
}
