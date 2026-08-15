import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Building2, UserCheck, Clock, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Venues', path: '/venues', icon: Building2 },
  { name: 'Vendors', path: '/vendors', icon: UserCheck },
  { name: 'Tracking', path: '/tracking', icon: Clock },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
];

const bottomItems = [
  { name: 'Calendar', path: '/calendar', icon: Calendar },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  
  const allItems = navItems;

  return (
    <aside className="w-64 bg-background border-r border-border h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <img src="/logo.png" alt="Events Vedika Logo" className="h-12 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[#b3395b] via-[#d64f4c] to-[#e7793d] text-transparent bg-clip-text" style={{ fontFamily: 'cursive, sans-serif' }}>Events Vedika</h2>
        </div>
        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Enterprise Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {allItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}

        <div className="pt-8 pb-2">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            System
          </div>
          {bottomItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-2"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg">
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
