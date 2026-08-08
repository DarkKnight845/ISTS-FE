import { useEffect, useState } from 'react';
import { getNotificationsRequest, markNotificationAsReadRequest, type NotificationDto } from '@/lib/api';

interface UseNotificationsResult {
  notifications: NotificationDto[] | null;
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  markAsRead: (notificationId: string) => Promise<void>;
  removeNotification: (notificationId: string) => void;
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

  // Drop a notification from the local list once the user has acted on it
  // (e.g. clicked through to the ticket). Keeps the menu tidy and avoids
  // stale rows that look like new notifications.
  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev?.filter((n) => n.id !== notificationId) ?? null);
  };

  const addNotification = (notification: NotificationDto) => {
    setNotifications((prev) => {
      // Skip if we already have a row for this id — duplicates arrive when
      // a fresh SignalR event races with the initial GET.
      if (prev?.some((n) => n.id === notification.id)) return prev;
      return prev ? [notification, ...prev] : [notification];
    });
  };

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
    removeNotification,
    addNotification,
  };
}
