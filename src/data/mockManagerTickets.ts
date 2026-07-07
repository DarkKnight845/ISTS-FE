export type ManagerTicketStatus = 'Active' | 'Resolved' | 'Ongoing';
export type ManagerTicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface ManagerTicket {
  id: string;
  backendId: string;
  subject: string;
  requester: string;
  requesterInitials: string;
  status: ManagerTicketStatus;
  priority: ManagerTicketPriority;
  assigned: string | null;
  updatedAt: string;
  createdAt: string;
  description: string;
  isBreach: boolean;
  overdueBy?: string;
}

