export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Event Manager';
}

const DEMO_USERS: User[] = [
  { id: '1', name: 'Siddhitha (Admin)', email: 'siddhithaAdmin@gmail.com', role: 'Admin' },
  { id: '2', name: 'Shivani', email: 'shivaniManager@gmail.com', role: 'Event Manager' },
  { id: '3', name: 'Siddhi', email: 'siddhiManager@gmail.com', role: 'Event Manager' },
  { id: '4', name: 'Basava', email: 'basavaManager@gmail.com', role: 'Event Manager' },
];

const DEMO_PASSWORDS: Record<string, string> = {
  'siddhithaAdmin@gmail.com': 'siddhi123',
  'shivaniManager@gmail.com': 'shivaniManager123',
  'siddhiManager@gmail.com': 'siddhiManager123',
  'basavaManager@gmail.com': 'basavaManager123',
};

const CURRENT_USER_KEY = 'event_crm_current_user';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = DEMO_USERS.find(u => u.email === email);
    if (!user || DEMO_PASSWORDS[email] !== password) {
      throw new Error('Invalid email or password');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as User;
    } catch {
      return null;
    }
  }
};
