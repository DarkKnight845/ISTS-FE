import { getCached, invalidateCache, setCached } from "./cache";
export { invalidateCache } from "./cache";
import { decodeJwt } from "./jwt";

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5011").replace(/\/$/, "");
export const SIGNALR_BASE_URL = ((import.meta.env.VITE_SIGNALR_BASE_URL as string | undefined) || API_BASE_URL).replace(/\/$/, "");

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

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface SLAPriorityInput {
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
}

export interface SLARuleDto {
  id: string;
  departmentId: string;
  priority: TicketPriority;
  responseTimeMinutes: number;
  resolutionTimeMinutes: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface SLARulesResponse {
  departmentId: string;
  slas: SLARuleDto[];
  /** Backend returns the list as `SLAs` (PascalCase). Keep both for safety. */
  SLAs?: SLARuleDto[];
}

export interface CreateSLARequest {
  departmentId: string;
  priorities: SLAPriorityInput[];
}

export interface UpdateSLARequest {
  departmentId: string;
  priorities: SLAPriorityInput[];
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

export interface ApiRequestOptions extends Omit<RequestInit, 'cache'> {
  /** When false, bypass the in-memory GET cache. Defaults to true. */
  cache?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const method = options.method?.toUpperCase() || "GET";
  const isGet = method === "GET";
  const useCache = options.cache !== false;

  if (isGet && useCache) {
    const cached = getCached<T>(endpoint);
    if (cached !== undefined) {
      return cached;
    }
  }

  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Strip our custom cache option before passing to fetch so it doesn't clash
  // with the native RequestInit.cache property (RequestCache enum).
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cache: _cache, ...fetchOptions } = options;

  const response = await fetch(url, {
    ...fetchOptions,
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

    const httpError = new Error(errors);
    (httpError as Error & { status?: number }).status = response.status;

    if (response.status === 401 && endpoint !== "/api/auth/login") {
      window.dispatchEvent(new Event("ists:auth:expired"));
    }

    throw httpError;
  }

  // Some endpoints return the payload directly instead of wrapping it.
  if (Array.isArray(body)) {
    if (isGet && useCache) {
      setCached(endpoint, body);
    }
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

  if (isGet && useCache) {
    setCached(endpoint, wrapped.data);
  }

  return wrapped.data;
}

export async function loginRequest(email: string, password: string) {
  return apiRequest<{ accessToken: string; accessTokenExpiresAt: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    cache: false,
  }).catch((err) => {
    const status = (err as { status?: number }).status;
    if (status === 401) {
      throw new Error("Incorrect email or password.");
    }
    if (status != null && status >= 500) {
      throw new Error("Something went wrong on our side. Please try again shortly.");
    }
    throw err;
  });
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  const exp = payload?.exp;
  if (typeof exp !== "number") return false;
  // exp is seconds since epoch; add a 60-second buffer to avoid edge cases.
  return exp * 1000 < Date.now() + 60_000;
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

export async function getTicketByIdRequest(ticketId: string) {
  return apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}`);
}

export async function getMyTicketsRequest() {
  return apiRequest<TicketResponseDto[]>("/api/tickets/my-tickets");
}

export async function getAssignedTicketsRequest() {
  return apiRequest<TicketResponseDto[]>("/api/tickets/assigned");
}

export async function getTicketAnalyticsRequest(filters?: { fromDate?: string; toDate?: string }) {
  const params = new URLSearchParams();
  if (filters?.fromDate) params.append("fromDate", filters.fromDate);
  if (filters?.toDate) params.append("toDate", filters.toDate);

  const query = params.toString();
  return apiRequest<TicketAnalyticsDto>(`/api/tickets/analytics${query ? `?${query}` : ""}`);
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
  const result = await apiRequest<object>("/api/Rating", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  invalidateCache("/api/Rating");
  invalidateCache("/api/tickets");
  return result;
}

export async function getBreachedTicketsRequest() {
  return apiRequest<TicketResponseDto[]>("/api/Tickets/breached");
}

export async function assignTicketRequest(ticketId: string, agentId: string) {
  const result = await apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}/assign`, {
    method: "PUT",
    body: JSON.stringify({ agentId }),
  });
  invalidateCache("/api/tickets");
  return result;
}

export async function updateTicketStatusRequest(ticketId: string, status: string) {
  const result = await apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
  invalidateCache("/api/tickets");
  return result;
}

export async function escalateTicketRequest(ticketId: string) {
  const result = await apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}/escalate`, {
    method: "PUT",
  });
  invalidateCache("/api/tickets");
  return result;
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
  // The backend validator requires Message to be non-empty. When sending an
  // attachment without text, supply a small placeholder so the request succeeds.
  const effectiveMessage = message.trim() || (attachment ? "Attachment" : "");
  formData.append("Message", effectiveMessage);
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

  invalidateCache("/api/tickets");
  return body.data;
}

export async function getNotificationsRequest() {
  return apiRequest<NotificationDto[]>("/api/notifications");
}

export async function markNotificationAsReadRequest(notificationId: string) {
  const result = await apiRequest<object>(`/api/notifications/${notificationId}/read`, {
    method: "PUT",
  });
  invalidateCache("/api/notifications");
  return result;
}

export async function getDepartmentsRequest() {
  return apiRequest<DepartmentDto[]>("/api/departments");
}

export async function getCategoriesRequest() {
  return apiRequest<CategoryDto[]>("/api/categories");
}

export async function getSLAByDepartmentRequest(departmentId: string) {
  return apiRequest<SLARulesResponse>(`/api/sla/${departmentId}`, { cache: false });
}

export async function createSLARequest(payload: CreateSLARequest) {
  const result = await apiRequest<SLARulesResponse>("/api/sla", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  invalidateCache(`/api/sla/${payload.departmentId}`);
  return result;
}

export async function updateSLARequest(payload: UpdateSLARequest) {
  const result = await apiRequest<SLARulesResponse>("/api/sla", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  invalidateCache(`/api/sla/${payload.departmentId}`);
  return result;
}

export interface UpdateTicketPayload {
  title: string;
  description: string;
  priority: string;
  departmentId: string;
  categoryId: string;
}

export async function updateTicketRequest(ticketId: string, payload: UpdateTicketPayload) {
  const result = await apiRequest<TicketResponseDto>(`/api/tickets/${ticketId}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  invalidateCache("/api/tickets");
  return result;
}

export async function deleteTicketRequest(ticketId: string) {
  const result = await apiRequest<object>(`/api/tickets/${ticketId}`, {
    method: "DELETE",
  });
  invalidateCache("/api/tickets");
  return result;
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
    formData.append("attachment", payload.attachment);
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

  invalidateCache("/api/tickets");
  return body.data;
}
