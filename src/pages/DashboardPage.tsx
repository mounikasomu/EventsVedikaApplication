import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { customerService } from '../services/customerService';
import { StatCard } from '../components/dashboard/StatCard';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { Users, UserPlus, RefreshCw, CheckCircle2, CalendarDays } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate network load for skeleton
      setIsLoading(true);
      setTimeout(() => {
        setMetrics(customerService.getDashboardMetrics(user));
        setIsLoading(false);
      }, 600);
    }
  }, [user]);

  if (!user) return null;

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome back, {user.role === 'Admin' ? 'Admin' : 'Manager'} {user.name.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here is what's happening with your events today.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[120px] bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {user.role === 'Admin' ? (
              <StatCard title="Total Customers" value={metrics?.metrics.totalCustomers || 0} icon={Users} trend="12%" isPositive />
            ) : (
              <StatCard title="Assigned Customers" value={metrics?.metrics.totalCustomers || 0} icon={Users} trend="12%" isPositive />
            )}
            <StatCard title="New Leads" value={metrics?.metrics.newLeads || 0} icon={UserPlus} trend="5%" isPositive />
            <StatCard title="In Progress" value={metrics?.metrics.inProgress || 0} icon={RefreshCw} />
            <StatCard title="Closed Events" value={metrics?.metrics.closed || 0} icon={CheckCircle2} />
            <StatCard title="Upcoming Events" value={metrics?.metrics.upcomingEvents || 0} icon={CalendarDays} />
          </div>
        )}

        <div className="space-y-6">
          {isLoading ? (
            <div className="h-[400px] bg-muted animate-pulse rounded-xl w-full" />
          ) : (
            <DashboardCharts 
              monthlyLeadsData={metrics?.charts.monthlyLeadsData || []} 
              eventTypesData={metrics?.charts.eventTypesData || []} 
            />
          )}
        </div>
      </div>
    </AppLayout>
  );
};
