export type EventType = 'Marriage' | 'Birthday' | 'Bachelor Party' | 'Corporate Event' | 'Reception' | 'Engagement' | 'Baby Shower' | 'Anniversary' | 'Other';
export type LeadType = 'Website' | 'Referral' | 'Walk-In' | 'Social Media' | 'Phone Call' | 'Advertisement';
export type CustomerStatus = 'New' | 'In Progress' | 'Closed';

export interface Customer {
  id: string;
  customerName: string;
  email: string;
  phoneNumber: string;
  guestCount: number;
  eventDate: string;
  eventLocation: string;
  eventType: EventType;
  leadType: LeadType;
  status: CustomerStatus;
  description: string;
  assignedTo: string | null; // Event Manager ID
  priority?: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
  revenue: number; // Added to support the Revenue KPI
}

export interface ActivityLog {
  id: string;
  customerId: string;
  action: string; // 'Customer Created', 'Customer Updated', 'Lead Assigned', 'Status Changed'
  timestamp: string;
  performedBy: string; // User Name
  details: string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const EVENT_TYPES: EventType[] = ['Marriage', 'Birthday', 'Bachelor Party', 'Corporate Event', 'Reception', 'Engagement', 'Baby Shower', 'Anniversary', 'Other'];
const LEAD_TYPES: LeadType[] = ['Website', 'Referral', 'Walk-In', 'Social Media', 'Phone Call', 'Advertisement'];
const STATUSES: CustomerStatus[] = ['New', 'In Progress', 'Closed'];

const DEMO_MANAGERS = [
  { id: '2', name: 'Shivani' },
  { id: '3', name: 'Siddhi' },
  { id: '4', name: 'Basava' },
];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

export const generateMockCustomers = (count: number): Customer[] => {
  const customers: Customer[] = [];
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const nextYear = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());

  for (let i = 0; i < count; i++) {
    const status = getRandomItem(STATUSES);
    const eventDate = status === 'Closed' ? getRandomDate(pastYear, now) : getRandomDate(now, nextYear);
    const createdAt = getRandomDate(pastYear, new Date(eventDate));

    customers.push({
      id: generateId(),
      customerName: `Customer ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      phoneNumber: `+1 555 ${getRandomInt(100, 999)} ${getRandomInt(1000, 9999)}`,
      guestCount: getRandomInt(20, 500),
      eventDate,
      eventLocation: `Venue ${getRandomInt(1, 20)}`,
      eventType: getRandomItem(EVENT_TYPES),
      leadType: getRandomItem(LEAD_TYPES),
      status,
      description: `Mock description for Customer ${i + 1}`,
      assignedTo: Math.random() > 0.2 ? getRandomItem(DEMO_MANAGERS).id : null,
      createdAt,
      updatedAt: createdAt,
      revenue: getRandomInt(1000, 25000),
    });
  }

  // Ensure there are some "Upcoming Events" today/tomorrow
  if (customers.length > 0) {
     const tomorrow = new Date(now);
     tomorrow.setDate(tomorrow.getDate() + 1);
     customers[0].eventDate = tomorrow.toISOString();
     customers[0].status = 'In Progress';
  }

  return customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const generateMockActivities = (customers: Customer[]): ActivityLog[] => {
  const activities: ActivityLog[] = [];
  
  customers.forEach(customer => {
    activities.push({
      id: generateId(),
      customerId: customer.id,
      action: 'Customer Created',
      timestamp: customer.createdAt,
      performedBy: 'System',
      details: `Lead created from ${customer.leadType}`
    });

    if (customer.assignedTo) {
      const manager = DEMO_MANAGERS.find(m => m.id === customer.assignedTo);
      activities.push({
        id: generateId(),
        customerId: customer.id,
        action: 'Lead Assigned',
        timestamp: customer.createdAt, // simplify mock data
        performedBy: 'Admin',
        details: `Assigned to ${manager?.name}`
      });
    }
  });

  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
