import { useCallback, useEffect, useRef, useState } from 'react';
import type * as signalR from '@microsoft/signalr';
import { getTicketMessagesRequest, type TicketMessageDto } from '@/lib/api';
import { joinTicketGroup, leaveTicketGroup } from '@/hooks/useSignalR';

interface UseTicketMessagesResult {
  messages: TicketMessageDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addMessage: (message: TicketMessageDto) => void;
}

export function useTicketMessages(
  ticketId: string | null,
  connection: signalR.HubConnection | null = null
): UseTicketMessagesResult {
  const [messages, setMessages] = useState<TicketMessageDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesRef = useRef<TicketMessageDto[] | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!ticketId) {
      setMessages(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getTicketMessagesRequest(ticketId);
      setMessages(data);
      messagesRef.current = data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setMessages(null);
      messagesRef.current = null;
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to real-time messages for this ticket.
  useEffect(() => {
    if (!connection || !ticketId) return;

    const handler = (message: TicketMessageDto) => {
      if (message.ticketId !== ticketId) return;
      // Don't double-add messages we already have (idempotent on re-mount).
      if (messagesRef.current?.some((m) => m.id === message.id)) return;
      setMessages((prev) => {
        const next = prev ? [...prev, message] : [message];
        messagesRef.current = next;
        return next;
      });
    };

    connection.on('ReceiveMessage', handler);

    // Join the ticket group so the server routes messages for this ticket to us.
    joinTicketGroup(connection, ticketId);

    return () => {
      connection.off('ReceiveMessage', handler);
      leaveTicketGroup(connection, ticketId);
    };
  }, [connection, ticketId]);

  const addMessage = (message: TicketMessageDto) => {
    setMessages((prev) => {
      if (prev?.some((m) => m.id === message.id)) return prev;
      const next = prev ? [...prev, message] : [message];
      messagesRef.current = next;
      return next;
    });
  };

  return { messages, loading, error, refetch: fetchMessages, addMessage };
}