import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface TicketDrawerContextValue {
  openTicketId: string | null;
  openTicket: (id: string) => void;
  closeTicket: () => void;
}

const TicketDrawerContext = createContext<TicketDrawerContextValue | undefined>(undefined);

export function TicketDrawerProvider({ children }: { children: ReactNode }) {
  const [openTicketId, setOpenTicketId] = useState<string | null>(null);

  const openTicket = useCallback((id: string) => setOpenTicketId(id), []);
  const closeTicket = useCallback(() => setOpenTicketId(null), []);

  const value = useMemo(
    () => ({ openTicketId, openTicket, closeTicket }),
    [openTicketId, openTicket, closeTicket]
  );

  return <TicketDrawerContext.Provider value={value}>{children}</TicketDrawerContext.Provider>;
}

export function useTicketDrawer(): TicketDrawerContextValue {
  const ctx = useContext(TicketDrawerContext);
  if (!ctx) {
    throw new Error('useTicketDrawer must be used within a TicketDrawerProvider');
  }
  return ctx;
}