import { useEffect, useState } from 'react';
import { getTicketMessagesRequest, type TicketMessageDto } from '@/lib/api';

interface UseTicketMessagesResult {
  messages: TicketMessageDto[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  addMessage: (message: TicketMessageDto) => void;
}

export function useTicketMessages(ticketId: string | null): UseTicketMessagesResult {
  const [messages, setMessages] = useState<TicketMessageDto[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load messages');
      setMessages(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const addMessage = (message: TicketMessageDto) => {
    setMessages((prev) => (prev ? [...prev, message] : [message]));
  };

  return { messages, loading, error, refetch: fetchMessages, addMessage };
}
