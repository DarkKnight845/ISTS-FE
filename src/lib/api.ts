export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5011";
export const SIGNALR_BASE_URL = import.meta.env.VITE_SIGNALR_BASE_URL || API_BASE_URL;

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T | null;
  errors: string[];
  traceId: string | null;
}

export interface CurrentUserDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  roles: string[];
  departmentId: string | null;
  departmentName: string | null;
}

export interface AgentDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  initials: string;
}

export interface TicketResponseDto {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedAgentId: string | null;
  assignedAgentName: string | null;
  createdById: string;
  createdByName: string;
  categoryId: string;
  categoryName: string;
  departmentId: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string | null;
  slaDueAt: string | null;
  isBreached: boolean;
  overdueBy: string | null;
  isRated: boolean;
  attachmentUrl: string | null;
}

export interface WeeklyTicketPoint {
  label: string;
  received: number;
  resolved: number;
}

export interface StatusDistributionSegment {
  label: string;
  value: number;
  color: string;
}

export interface AgentWorkloadEntry {
  name: string;
  initials: string;
  open: number;
  resolved: number;
}

export interface InsightItem {
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
}

export interface TicketAnalyticsDto {
  weeklyVolume: WeeklyTicketPoint[];
  statusDistribution: StatusDistributionSegment[];
  priorityDistribution: StatusDistributionSegment[];
  agentWorkload: AgentWorkloadEntry[];
  slaCompliancePercentage: number;
  averageResolutionTime: string;
  insights: InsightItem[];
}

export interface TicketMessageDto {
  id: string;
  ticketId: string;
  senderUserId: string;
  senderName: string;
  message: string;
  isInternal: boolean;
  attachmentUrl: string | null;
  createdAt: string;
}

export interface NotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  ticketId: string | null;
}

export interface DepartmentDto {
  id: string;
  name: string;
  description: string;
  categories?: CategoryDto[];
}

export interface CategoryDto {
  id: string;
  name: string;
  departmentId?: string;
}

export function getToken(): string | null {
  return localStorage.getItem("ists_access_token");
}

export function setToken(token: string | null) {
  if (token) {
    localStorage.setItem("ists_access_token", token);
  } else {
    localStorage.removeItem("ists_access_token");
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const wrapped = body as ApiResponse<unknown> | null;
    const errors = wrapped?.errors?.length
      ? wrapped.errors.join("\n")
      : wrapped?.message || `HTTP ${response.status}`;
    throw new Error(errors);
  }

  // Some endpoints return the payload directly instead of wrapping it.
  if (Array.isArray(body)) {
    return body as T;
  }

  const wrapped = body as ApiResponse<T> | null;
  if (!wrapped?.succeeded) {
    const errors = wrapped?.errors?.length
      ? wrapped.errors.join("\n")
      : wrapped?.message || `HTTP ${response.status}`;
    throw new Error(errors);
  }

  if (wrapped.data === null || wrapped.data === undefined) {
    throw new Error("Empty response from server");
  }

  return wrapped.data;
}

export async function loginRequest(email: string, password: string) {
  return apiRequest<{ accessToken: string; accessTokenExpiresAt: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUserRequest() {
  return apiRequest<CurrentUserDto>("/api/users/me");
}

export async function getAgentsRequest() {
  return apiRequest<AgentDto[]>("/api/users/agents");
}

export interface GetTicketsFilters {
  departmentId?: string;
  categoryId?: string;
  status?: string;
  priority?: string;
  fromDate?: string;
  toDate?: string;
}

export async function getTicketsRequest(filters?: GetTicketsFilters) {
  const params = new URLSearchParams();
  if (filters?.departmentId) params.append("departmentId", filters.departmentId);
  if (filters?.categoryId) params.append("categoryId", filters.categoryId);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.priority) params.append("priority", filters.priority);
  if (filters?.fromDate) params.append("fromDate", filters.fromDate);
  if (filters?.toDate) params.append("toDate", filters.toDate);

  const query = params.toString();
  return apiRequest<TicketResponseDto[]>(`/api/tickets${query ? `?${query}` : ""}`);
}

export async function getMyTicketsRequest() {
  return apiRequest<TicketResponseDto[]>("/api/tickets/my-tickets");
}

export async function getAssignedTicketsRequest() {
  return apiRequest<TicketResponseDto[]>("/api/tickets/assigned");
}

export async function getTicketAnalyticsRequest() {
  return apiRequest<TicketAnalyticsDto>("/api/tickets/analytics");
}

export interface AverageRatingDto {
  averageRating: number;
  totalRatings: number;
}

export async function getAverageRatingRequest(agentId?: string | null) {
  const params = new URLSearchParams();
  if (agentId) params.append("agentId", agentId);
  const query = params.toString();
  return apiRequest<AverageRatingDto>(`/api/Rating/average${query ? `?${query}` : ""}`);
}

export interface CreateRatingPayload {
  ticketId: string;
  rating: number;
  comment?: string;
}

export async function createRatingRequest(payload: CreateRatingPayload) {
  return apiRequest<object>("/api/Rating", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getBreachedTicketsRequest() {
  return apiRequest<TicketResponseDto[]>("/api/Tickets/breached");
}

export async function assignTicketRequest(ticketId: string, agentId: string) {
  return apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}/assign`, {
    method: "PUT",
    body: JSON.stringify({ agentId }),
  });
}

export async function updateTicketStatusRequest(ticketId: string, status: string) {
  return apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function escalateTicketRequest(ticketId: string) {
  return apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}/escalate`, {
    method: "PUT",
  });
}

export async function getTicketMessagesRequest(ticketId: string) {
  return apiRequest<TicketMessageDto[]>(`/api/tickets/${ticketId}/messages`);
}

export async function sendTicketMessageRequest(
  ticketId: string,
  message: string,
  attachment?: File | null,
  isInternal = false
) {
  const formData = new FormData();
  formData.append("Message", message);
  formData.append("IsInternal", String(isInternal));
  if (attachment) {
    formData.append("attachment", attachment);
  }

  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}/api/tickets/${ticketId}/messages`, {
    method: "POST",
    headers,
    body: formData,
  });

  let body: ApiResponse<TicketMessageDto> | null = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok || !body?.succeeded) {
    const errors = body?.errors?.length ? body.errors.join("\n") : body?.message || `HTTP ${response.status}`;
    throw new Error(errors);
  }

  if (body.data === null || body.data === undefined) {
    throw new Error("Empty response from server");
  }

  return body.data;
}

export async function getNotificationsRequest() {
  return apiRequest<NotificationDto[]>("/api/notifications");
}

export async function markNotificationAsReadRequest(notificationId: string) {
  return apiRequest<object>(`/api/notifications/${notificationId}/read`, {
    method: "PUT",
  });
}

export async function getDepartmentsRequest() {
  return apiRequest<DepartmentDto[]>("/api/departments");
}

export async function getCategoriesRequest() {
  return apiRequest<CategoryDto[]>("/api/categories");
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: string;
  departmentId: string;
  categoryId: string;
  attachment?: File | null;
}

export async function createTicketRequest(payload: CreateTicketPayload) {
  const formData = new FormData();
  formData.append("Title", payload.title);
  formData.append("Description", payload.description);
  formData.append("Priority", payload.priority);
  formData.append("DepartmentId", payload.departmentId);
  formData.append("CategoryId", payload.categoryId);
  if (payload.attachment) {
    formData.append("Attachment", payload.attachment);
  }

  const token = getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: "POST",
    headers,
    body: formData,
  });

  let body: ApiResponse<TicketResponseDto> | null = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok || !body?.succeeded) {
    const errors = body?.errors?.length ? body.errors.join("\n") : body?.message || `HTTP ${response.status}`;
    throw new Error(errors);
  }

  if (body.data === null || body.data === undefined) {
    throw new Error("Empty response from server");
  }

  return body.data;
}
