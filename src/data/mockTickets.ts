export type TicketStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed' | 'Active' | 'Ongoing' | 'Waiting';
export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low' | 'Critical';

export interface Message {
  id: string;
  sender: 'user' | 'agent';
  author: string;
  avatar?: string;
  text: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  backendId: string;
  subject: string;
  requester: string;
  requesterAvatar?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned: string | null;
  updatedAt: string;
  createdAt: string;
  messages?: Message[];
}

