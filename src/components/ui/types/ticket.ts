export type TicketStatus = "Open" | "Ongoing" | "Resolved" | "Closed" | "Waiting";
export type TicketPriority = "Low" | "Medium" | "High" | "Critical" | "Urgent";

export type Ticket = {
  id: string;
  backendId: string;
  subject: string;
  department: string;
  departmentId: string;
  category: string;
  categoryId: string;
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
