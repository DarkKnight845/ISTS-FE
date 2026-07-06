export type TicketStatus = 'Active' | 'Resolved' | 'Ongoing';
export type TicketPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

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
  subject: string;
  requester: string;
  requesterAvatar?: string;
  status: TicketStatus;
  priority: TicketPriority;
  assigned: string | null;
  updatedAt: string;
  createdAt: string;
  messages: Message[];
}

export const mockTickets: Ticket[] = [
  {
    id: 'TKT-00007',
    subject: 'Blue Screen showing',
    requester: 'Chisom Edun & Lami Sobowale',
    requesterAvatar: undefined,
    status: 'Active',
    priority: 'Urgent',
    assigned: 'Chisom Mabuchi',
    updatedAt: '20 mins ago',
    createdAt: '9:00am',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        author: 'Chisom Edun & Lami Sobowale',
        text: 'My screen is completely dark now but my keyboard lights are still on and the power button light as well',
        timestamp: '12:04pm',
      },
      {
        id: 'm2',
        sender: 'agent',
        author: 'Agent',
        text: 'Try connecting your laptop to a power source and long pressing on the power button for about 10 seconds.',
        timestamp: '12:05pm',
      },
      {
        id: 'm3',
        sender: 'agent',
        author: 'Agent',
        text: 'If nothing changes please bring it upstairs we might have to open it up.',
        timestamp: '12:05pm',
      },
    ],
  },
  {
    id: 'TKT-00023',
    subject: 'Laptop not powering on after update',
    requester: 'Moji Akande',
    requesterAvatar: undefined,
    status: 'Resolved',
    priority: 'High',
    assigned: null,
    updatedAt: '2hrs ago',
    createdAt: '9:00am',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        author: 'Moji Akande',
        text: 'My laptop shut down during the update and now it will not turn on.',
        timestamp: '10:00am',
      },
      {
        id: 'm2',
        sender: 'agent',
        author: 'Agent',
        text: 'Hold the power button for 30 seconds, then plug in the charger and try again.',
        timestamp: '10:15am',
      },
    ],
  },
  {
    id: 'TKT-00023',
    subject: 'Laptop not powering on after update',
    requester: 'Moji Akande',
    requesterAvatar: undefined,
    status: 'Ongoing',
    priority: 'High',
    assigned: 'Moji Akande',
    updatedAt: '2hrs ago',
    createdAt: '9:00am',
    messages: [
      {
        id: 'm1',
        sender: 'user',
        author: 'Moji Akande',
        text: 'Still seeing the same issue after restart.',
        timestamp: '11:00am',
      },
    ],
  },
];
