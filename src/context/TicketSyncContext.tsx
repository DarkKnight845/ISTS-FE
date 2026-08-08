import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from 'react';

/**
 * Lightweight pub/sub for ticket-list refreshes. Pages dispatch when their
 * ticket list refetches (after create/edit/delete or a SignalR push); the
 * drawer host subscribes so the open ticket stays in sync with what the
 * list just saw.
 *
 * This is a ref-based bus so subscribers fire only when ids change — list
 * refetches that don't touch the open ticket are cheap.
 */

type TicketChangeListener = (ticketId: string | null) => void;

interface TicketSyncContextValue {
  /** Notify subscribers that a specific ticket (or all, when null) changed. */
  notifyTicketChanged: (ticketId: string | null) => void;
  /** Subscribe to ticket-change events. Returns an unsubscribe function. */
  subscribe: (listener: TicketChangeListener) => () => void;
}

const TicketSyncContext = createContext<TicketSyncContextValue | null>(null);

export function TicketSyncProvider({ children }: { children: ReactNode }) {
  const listenersRef = useRef<Set<TicketChangeListener>>(new Set());

  const notifyTicketChanged = useCallback((ticketId: string | null) => {
    listenersRef.current.forEach((listener) => listener(ticketId));
  }, []);

  const subscribe = useCallback((listener: TicketChangeListener) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  const value = useMemo(
    () => ({ notifyTicketChanged, subscribe }),
    [notifyTicketChanged, subscribe]
  );

  return <TicketSyncContext.Provider value={value}>{children}</TicketSyncContext.Provider>;
}

export function useTicketSync(): TicketSyncContextValue {
  const ctx = useContext(TicketSyncContext);
  if (!ctx) {
    // No provider — return a no-op so call sites don't have to gate on it.
    return {
      notifyTicketChanged: () => {},
      subscribe: () => () => {},
    };
  }
  return ctx;
}
