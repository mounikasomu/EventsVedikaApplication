import { generateMockCustomers, generateMockActivities, type Customer, type ActivityLog } from '../data/mockData';
import type { User } from './authService';

const CUSTOMERS_KEY = 'event_crm_customers';
const ACTIVITIES_KEY = 'event_crm_activities';

export const customerService = {
  initializeDemoData: () => {
    if (!localStorage.getItem(CUSTOMERS_KEY)) {
      const customers = generateMockCustomers(5);
      const activities = generateMockActivities(customers);
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
    }
  },

  getAllCustomers: (): Customer[] => {
    const data = localStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getCustomersForUser: (user: User): Customer[] => {
    const all = customerService.getAllCustomers();
    if (user.role === 'Admin') return all;
    return all.filter(c => c.assignedTo === user.id);
  },

  getAllActivities: (): ActivityLog[] => {
    const data = localStorage.getItem(ACTIVITIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  getActivitiesForUser: (user: User): ActivityLog[] => {
    const allActivities = customerService.getAllActivities();
    if (user.role === 'Admin') return allActivities;
    
    // For managers, only show activities related to their assigned customers
    const myCustomers = customerService.getCustomersForUser(user).map(c => c.id);
    return allActivities.filter(a => myCustomers.includes(a.customerId));
  },

  getDashboardMetrics: (user: User) => {
    const customers = customerService.getCustomersForUser(user);
    const now = new Date();
    
    // Basic Counts
    const totalCustomers = customers.length;
    const newLeads = customers.filter(c => c.status === 'New').length;
    const inProgress = customers.filter(c => c.status === 'In Progress').length;
    const closed = customers.filter(c => c.status === 'Closed').length;
    
    // Revenue (Sum of revenue for Closed and In Progress)
    const totalRevenue = customers
      .filter(c => c.status !== 'New')
      .reduce((sum, c) => sum + (c.revenue || 0), 0);

    // Upcoming Events (next 30 days)
    const upcomingEvents = customers.filter(c => {
      const eventDate = new Date(c.eventDate);
      const diffTime = eventDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30 && c.status !== 'Closed';
    }).length;

    // Monthly Leads for Chart
    const monthlyLeadsMap = new Map<string, number>();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthlyLeadsMap.set(months[d.getMonth()], 0);
    }
    
    customers.forEach(c => {
      const d = new Date(c.createdAt);
      if (!isNaN(d.getTime())) {
        const monthName = months[d.getMonth()];
        if (monthlyLeadsMap.has(monthName)) {
          monthlyLeadsMap.set(monthName, (monthlyLeadsMap.get(monthName) || 0) + 1);
        }
      }
    });

    const monthlyLeadsData = Array.from(monthlyLeadsMap.entries()).map(([name, count]) => ({ name, count }));

    // Event Types Distribution
    const eventTypesMap = new Map<string, number>();
    customers.forEach(c => {
      eventTypesMap.set(c.eventType, (eventTypesMap.get(c.eventType) || 0) + 1);
    });
    const eventTypesData = Array.from(eventTypesMap.entries()).map(([name, value]) => ({ name, value }));

    // Lead Sources Distribution
    const leadSourcesMap = new Map<string, number>();
    customers.forEach(c => {
      leadSourcesMap.set(c.leadType, (leadSourcesMap.get(c.leadType) || 0) + 1);
    });
    const leadSourcesData = Array.from(leadSourcesMap.entries()).map(([name, value]) => ({ name, value }));

    return {
      metrics: {
        totalCustomers,
        newLeads,
        inProgress,
        closed,
        upcomingEvents,
        totalRevenue
      },
      charts: {
        monthlyLeadsData,
        eventTypesData,
        leadSourcesData
      }
    };
  },

  getReportMetrics: (user: User, filters: { dateRange: string; status: string; eventType: string; leadType: string; assignedTo: string }) => {
    let customers = customerService.getCustomersForUser(user);

    // Apply filters
    if (filters.status && filters.status !== 'All') {
      customers = customers.filter(c => c.status === filters.status);
    }
    if (filters.eventType && filters.eventType !== 'All') {
      customers = customers.filter(c => c.eventType === filters.eventType);
    }
    if (filters.leadType && filters.leadType !== 'All') {
      customers = customers.filter(c => c.leadType === filters.leadType);
    }
    if (filters.assignedTo && filters.assignedTo !== 'All') {
      customers = customers.filter(c => c.assignedTo === filters.assignedTo);
    }

    if (filters.dateRange !== 'All Time') {
      const now = new Date();
      let threshold = new Date();
      if (filters.dateRange === 'Last 7 Days') {
        threshold.setDate(now.getDate() - 7);
      } else if (filters.dateRange === 'Last 30 Days') {
        threshold.setDate(now.getDate() - 30);
      } else if (filters.dateRange === 'This Year') {
        threshold.setFullYear(now.getFullYear(), 0, 1);
      }
      customers = customers.filter(c => {
        if (!c.createdAt) return false;
        const d = new Date(c.createdAt);
        return !isNaN(d.getTime()) && d >= threshold;
      });
    }

    const totalLeads = customers.length;
    const closedLeads = customers.filter(c => c.status === 'Closed').length;
    const openLeads = totalLeads - closedLeads;
    const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) + '%' : '0%';
    const averageGuestCount = totalLeads > 0 ? Math.round(customers.reduce((acc, curr) => acc + (Number(curr.guestCount) || 0), 0) / totalLeads) : 0;

    const eventTypeCounts: Record<string, number> = {};
    customers.forEach(c => {
      eventTypeCounts[c.eventType] = (eventTypeCounts[c.eventType] || 0) + 1;
    });
    
    let mostPopularEventType = 'N/A';
    let maxCount = 0;
    Object.entries(eventTypeCounts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostPopularEventType = type;
      }
    });

    const monthlyLeadsData = [
      { name: 'Jan', value: 0 }, { name: 'Feb', value: 0 }, { name: 'Mar', value: 0 },
      { name: 'Apr', value: 0 }, { name: 'May', value: 0 }, { name: 'Jun', value: 0 },
      { name: 'Jul', value: 0 }, { name: 'Aug', value: 0 }, { name: 'Sep', value: 0 },
      { name: 'Oct', value: 0 }, { name: 'Nov', value: 0 }, { name: 'Dec', value: 0 }
    ];
    customers.forEach(c => {
      if (c.createdAt) {
        const d = new Date(c.createdAt);
        if (!isNaN(d.getTime()) && d.getFullYear() === new Date().getFullYear()) {
          monthlyLeadsData[d.getMonth()].value += 1;
        }
      }
    });

    const statusDistribution = [
      { name: 'New', value: customers.filter(c => c.status === 'New').length },
      { name: 'In Progress', value: customers.filter(c => c.status === 'In Progress').length },
      { name: 'Closed', value: closedLeads }
    ].filter(item => item.value > 0);

    const eventTypeDistribution = Object.entries(eventTypeCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    const managerNames: Record<string, string> = { '2': 'Shivani L.', '3': 'Siddhi M.', '4': 'Basava K.' };
    const leadsByManagerCounts: Record<string, number> = {};
    customers.forEach(c => {
      const mId = c.assignedTo;
      if (mId) {
        const mName = managerNames[mId] || 'Admin';
        leadsByManagerCounts[mName] = (leadsByManagerCounts[mName] || 0) + 1;
      }
    });
    const leadsByManager = Object.entries(leadsByManagerCounts).map(([name, value]) => ({ name, value }));

    const summaryTableMap: Record<string, any> = {};
    customers.forEach(c => {
      const mId = c.assignedTo || 'unassigned';
      const mName = mId === 'unassigned' ? 'Unassigned' : (managerNames[mId] || 'Admin');
      
      if (!summaryTableMap[mId]) {
        summaryTableMap[mId] = { manager: mName, assignedLeads: 0, completedLeads: 0, pendingLeads: 0 };
      }
      summaryTableMap[mId].assignedLeads += 1;
      if (c.status === 'Closed') summaryTableMap[mId].completedLeads += 1;
      else summaryTableMap[mId].pendingLeads += 1;
    });
    
    const summaryTable = Object.values(summaryTableMap).sort((a, b) => b.assignedLeads - a.assignedLeads);

    return {
      kpis: {
        totalLeads,
        closedLeads,
        openLeads,
        conversionRate,
        averageGuestCount,
        mostPopularEventType
      },
      charts: {
        monthlyLeadsData,
        statusDistribution,
        eventTypeDistribution,
        leadsByManager
      },
      summaryTable
    };
  },

  addCustomer: (data: Partial<Customer>, user: User): Customer => {
    const customers = customerService.getAllCustomers();
    const activities = customerService.getAllActivities();
    
    const now = new Date().toISOString();
    const newCustomer: Customer = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
      revenue: data.revenue || Math.floor(Math.random() * (15000 - 1000 + 1)) + 1000, // Mock revenue if not provided
    } as Customer;

    const newActivity: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: newCustomer.id,
      action: 'Customer Created',
      timestamp: now,
      performedBy: user.name,
      details: `Lead created from ${newCustomer.leadType}`
    };

    customers.unshift(newCustomer);
    activities.unshift(newActivity);

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));

    return newCustomer;
  },

  getCustomerById: (id: string, user: User): Customer | null => {
    const customers = customerService.getCustomersForUser(user);
    return customers.find(c => c.id === id) || null;
  },

  updateCustomer: (id: string, data: Partial<Customer>, user: User): Customer | null => {
    const customers = customerService.getAllCustomers();
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) return null;

    // Permissions check
    if (user.role === 'Event Manager' && customers[customerIndex].assignedTo !== user.id) {
      return null;
    }

    const now = new Date().toISOString();
    const updatedCustomer = {
      ...customers[customerIndex],
      ...data,
      updatedAt: now
    };

    customers[customerIndex] = updatedCustomer;
    
    const activities = customerService.getAllActivities();
    const newActivity: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: id,
      action: 'Customer Updated',
      timestamp: now,
      performedBy: user.name,
      details: 'Customer details were updated'
    };
    activities.unshift(newActivity);

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));

    return updatedCustomer;
  },

  assignCustomer: (id: string, assignedTo: string, priority: string, status: string, notes: string, user: User): Customer | null => {
    const customers = customerService.getAllCustomers();
    const customerIndex = customers.findIndex(c => c.id === id);
    
    if (customerIndex === -1) return null;

    // Permissions check: Managers can only assign to themselves (their user.id)
    if (user.role === 'Event Manager' && assignedTo !== user.id) {
      return null;
    }

    const now = new Date().toISOString();
    const updatedCustomer = {
      ...customers[customerIndex],
      assignedTo,
      priority: priority as 'Low' | 'Medium' | 'High',
      status: status as 'New' | 'In Progress' | 'Closed',
      updatedAt: now
    };

    customers[customerIndex] = updatedCustomer;
    
    const activities = customerService.getAllActivities();
    const managerNames: Record<string, string> = { '2': 'Shivani L.', '3': 'Siddhi M.', '4': 'Basava K.' };
    const assigneeName = managerNames[assignedTo] || 'Admin';

    const newActivity: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: id,
      action: 'Lead Assigned',
      timestamp: now,
      performedBy: user.name,
      details: `Assigned to ${assigneeName} with ${priority} priority. Status changed to ${status}. Notes: ${notes}`
    };
    activities.unshift(newActivity);

    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));

    return updatedCustomer;
  },

  getActivitiesForCustomer: (customerId: string): ActivityLog[] => {
    const allActivities = customerService.getAllActivities();
    return allActivities.filter(a => a.customerId === customerId);
  }
};
