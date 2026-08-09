import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { getToken, SIGNALR_BASE_URL } from '@/lib/api';
import type { TicketMessageDto, NotificationDto } from '@/lib/api';

interface UseSignalRResult {
  connection: signalR.HubConnection | null;
  notificationConnection: signalR.HubConnection | null;
  connected: boolean;
  error: string | null;
}

type SignalRListener = {
  onMessage?: (message: TicketMessageDto) => void;
  onNotification?: (notification: NotificationDto) => void;
  onTyping?: (payload: { userId: string; userName: string; ticketId: string }) => void;
  onReadReceipt?: (payload: { userId: string; ticketId: string }) => void;
};

export function useSignalR(listeners: SignalRListener = {}): UseSignalRResult {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supportConnectionRef = useRef<signalR.HubConnection | null>(null);
  const notificationConnectionRef = useRef<signalR.HubConnection | null>(null);
  const listenersRef = useRef(listeners);

  useEffect(() => {
    listenersRef.current = listeners;
  }, [listeners]);

  useEffect(() => {
    const buildConnection = () => {
      // No token yet — tear down any previous connection and wait for login.
      if (!getToken()) {
        supportConnectionRef.current = null;
        notificationConnectionRef.current = null;
        setConnected(false);
        return () => {};
      }

      // Read the token fresh every time SignalR needs it (initial connect and
      // every automatic reconnect). This fixes the "connection expires after the
      // page has been open for a while" issue caused by a stale closure over the
      // token captured at mount.
      const supportConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${SIGNALR_BASE_URL}/hubs/support`, {
          accessTokenFactory: () => getToken() ?? '',
        })
        .withAutomaticReconnect([0, 1000, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      const notificationConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${SIGNALR_BASE_URL}/hubs/notifications`, {
          accessTokenFactory: () => getToken() ?? '',
        })
        .withAutomaticReconnect([0, 1000, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      supportConnectionRef.current = supportConnection;
      notificationConnectionRef.current = notificationConnection;

      supportConnection.on('ReceiveMessage', (message: TicketMessageDto) => {
        listenersRef.current.onMessage?.(message);
      });
      supportConnection.on('Typing', (payload: { userId: string; userName: string; ticketId: string }) => {
        listenersRef.current.onTyping?.(payload);
      });
      supportConnection.on('ReadReceipt', (payload: { userId: string; ticketId: string }) => {
        listenersRef.current.onReadReceipt?.(payload);
      });

      notificationConnection.on('Notification', (notification: NotificationDto) => {
        listenersRef.current.onNotification?.(notification);
      });

      const updateState = () => {
        const isSupportConnected = supportConnection.state === signalR.HubConnectionState.Connected;
        const isNotificationConnected = notificationConnection.state === signalR.HubConnectionState.Connected;
        setConnected(isSupportConnected && isNotificationConnected);
      };

      const startConnections = async () => {
        try {
          await Promise.all([supportConnection.start(), notificationConnection.start()]);
          updateState();
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'SignalR connection failed');
        }
      };

      supportConnection.onclose((error) => {
        updateState();
        if (error?.message?.includes('401') || error?.message?.includes('auth')) {
          window.dispatchEvent(new CustomEvent('ists:auth:expired'));
        }
      });
      supportConnection.onreconnecting(() => updateState());
      supportConnection.onreconnected(() => updateState());
      notificationConnection.onclose((error) => {
        updateState();
        if (error?.message?.includes('401') || error?.message?.includes('auth')) {
          window.dispatchEvent(new CustomEvent('ists:auth:expired'));
        }
      });
      notificationConnection.onreconnecting(() => updateState());
      notificationConnection.onreconnected(() => updateState());

      startConnections();

      return () => {
        supportConnection.stop();
        notificationConnection.stop();
      };
    };

    let cleanup = buildConnection();

    // Rebuild the connection if the stored token changes while the page is open.
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'ists_access_token') {
        cleanup?.();
        cleanup = buildConnection();
      }
    };

    const handleAuthExpired = () => {
      cleanup?.();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ists:auth:expired', handleAuthExpired);

    return () => {
      cleanup?.();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ists:auth:expired', handleAuthExpired);
    };
  }, []);

  return {
    connection: supportConnectionRef.current,
    notificationConnection: notificationConnectionRef.current,
    connected,
    error,
  };
}

export async function joinTicketGroup(connection: signalR.HubConnection | null, ticketId: string) {
  if (!connection) return;
  try {
    await connection.invoke('JoinTicketGroup', ticketId);
  } catch {
    // Ignore join failures
  }
}

export async function leaveTicketGroup(connection: signalR.HubConnection | null, ticketId: string) {
  if (!connection) return;
  try {
    await connection.invoke('LeaveTicketGroup', ticketId);
  } catch {
    // Ignore leave failures
  }
}
