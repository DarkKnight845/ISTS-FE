import { useEffect, useState } from 'react';
import { getNotificationsRequest, markNotificationAsReadRequest, type NotificationDto } from '@/lib/api';

interface UseNotificationsResult {
  notifications: NotificationDto[] | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  markAsRead: (notificationId: string) => Promise<void>;
  addNotification: (notification: NotificationDto) => void;
}

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<NotificationDto[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificationsRequest();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
      setNotifications(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId: string) => {
    await markNotificationAsReadRequest(notificationId);
    setNotifications((prev) =>
      prev?.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)) ?? null
    );
  };

  const addNotification = (notification: NotificationDto) => {
    setNotifications((prev) => (prev ? [notification, ...prev] : [notification]));
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return { notifications, unreadCount, loading, error, refetch: fetchNotifications, markAsRead, addNotification };
}
