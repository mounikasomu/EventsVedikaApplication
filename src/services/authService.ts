export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Event Manager';
}

const DEMO_USERS: User[] = [
  { id: '1', name: 'mounikasomu (Admin)', email: 'mounikasomu@gmail.com', role: 'Admin' },
  { id: '2', name: 'manager', email: 'manager@gmail.com', role: 'Event Manager' },
  { id: '3', name: 'mouni', email: 'mouniManager@gmail.com', role: 'Event Manager' },
  { id: '4', name: 'Krishnakanth', email: 'krishnakanthManager@gmail.com', role: 'Event Manager' },
];

const DEMO_PASSWORDS: Record<string, string> = {
  'mounikasomu@gmail.com': 'mouni123',
  'manager@gmail.com': 'manager123',
  'mounimanager@gmail.com': 'mouniManager123',
  'krishnakanthManager@gmail.com': 'krishnakanthManager123',
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
