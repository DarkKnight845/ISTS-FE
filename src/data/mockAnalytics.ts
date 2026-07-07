export interface WeeklyPoint {
  label: string;
  received: number;
  resolved: number;
}

export interface StatusSegment {
  label: string;
  value: number;
  color: string;
}

export interface AgentLoad {
  name: string;
  initials: string;
  open: number;
  resolved: number;
}

export interface Insight {
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
}

export const weeklyTrend: WeeklyPoint[] = [
  { label: 'W1', received: 24, resolved: 18 },
  { label: 'W2', received: 32, resolved: 26 },
  { label: 'W3', received: 28, resolved: 30 },
  { label: 'W4', received: 45, resolved: 34 },
  { label: 'W5', received: 38, resolved: 40 },
  { label: 'W6', received: 34, resolved: 36 },
  { label: 'W7', received: 41, resolved: 39 },
];

export const statusDistribution: StatusSegment[] = [
  { label: 'Active', value: 14, color: '#2559AA' },
  { label: 'Ongoing', value: 8, color: '#F59E0B' },
  { label: 'Resolved', value: 21, color: '#16A34A' },
];

export const priorityDistribution: StatusSegment[] = [
  { label: 'Urgent', value: 6, color: '#DC2626' },
  { label: 'High', value: 12, color: '#F59E0B' },
  { label: 'Medium', value: 18, color: '#3B82F6' },
  { label: 'Low', value: 7, color: '#10B981' },
];

export const agentWorkload: AgentLoad[] = [
  { name: 'Chisom Mabuchi', initials: 'CM', open: 8, resolved: 12 },
  { name: 'Coleman Damingo', initials: 'CD', open: 6, resolved: 9 },
  { name: 'Megan Fox', initials: 'MF', open: 4, resolved: 7 },
  { name: 'Odunsi the engine', initials: 'OE', open: 3, resolved: 5 },
];

export const insights: Insight[] = [
  { label: 'Avg. resolution time', value: '4h 12m', change: '8% faster', changeUp: true },
  { label: 'Open tickets', value: '34', change: '5% vs last week', changeUp: false },
  { label: 'SLA breaches', value: '4', change: '2 more than last week', changeUp: false },
  { label: 'Top agent', value: 'Chisom M.', change: '12 resolved', changeUp: true },
];

export const slaCompliance = 78;
