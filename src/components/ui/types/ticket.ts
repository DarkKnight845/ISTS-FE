export type Ticket = {
  id: number;
  subject: string;
  department: string;
  category: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Waiting";
  createdAt: string;
};