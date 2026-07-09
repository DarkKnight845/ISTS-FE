export type TicketStatus = "Open" | "InProgress" | "Resolved" | "Closed" | "Waiting" | "Active" | "Ongoing";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical" | "Urgent";

export type Ticket = {
  id: string;
  backendId: string;
  subject: string;
  department: string;
  category: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  requester: string;
  requesterId: string;
  assigned: string | null;
  createdAt: string;
  createdAtDate: string;
  updatedAt: string;
  isRated: boolean;
  attachmentUrl: string | null;
};