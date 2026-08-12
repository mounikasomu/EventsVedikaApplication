import { Search, Bell, HelpCircle, Grip } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/Input';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10 bg-muted/50 border-none w-full max-w-md h-10" 
            placeholder="Search leads, events, or reports..." 
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Grip className="h-5 w-5" />
        </button>
        
        <div className="h-6 w-px bg-border mx-2"></div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden sm:inline-block">{user?.name}</span>
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
