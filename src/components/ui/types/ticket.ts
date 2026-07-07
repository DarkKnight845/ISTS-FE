export type TicketStatus = "Open" | "InProgress" | "Resolved" | "Closed" | "Waiting";
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
  assigned: string | null;
  createdAt: string;
  updatedAt: string;
};