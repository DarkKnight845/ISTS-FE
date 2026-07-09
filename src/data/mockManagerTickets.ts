export type ManagerTicketStatus = 'Active' | 'Resolved' | 'Ongoing';
export type ManagerTicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface ManagerTicket {
  id: string;
  backendId: string;
  subject: string;
  requester: string;
  requesterId: string;
  requesterInitials: string;
  status: ManagerTicketStatus;
  priority: ManagerTicketPriority;
  assigned: string | null;
  updatedAt: string;
  createdAt: string;
  createdAtDate: string;
  description: string;
  isBreach: boolean;
  isRated?: boolean;
  overdueBy?: string;
}

