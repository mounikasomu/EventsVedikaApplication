import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import type { ActivityLog } from '../../data/mockData';
import { UserPlus, Edit3, UserCheck, RefreshCw, Circle } from 'lucide-react';

const getActivityIcon = (action: string) => {
  switch (action) {
    case 'Customer Created': return <UserPlus className="h-4 w-4 text-emerald-500" />;
    case 'Customer Updated': return <Edit3 className="h-4 w-4 text-blue-500" />;
    case 'Lead Assigned': return <UserCheck className="h-4 w-4 text-purple-500" />;
    case 'Status Changed': return <RefreshCw className="h-4 w-4 text-orange-500" />;
    default: return <Circle className="h-4 w-4 text-gray-500" />;
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export const RecentActivities = ({ activities }: { activities: ActivityLog[] }) => {
  // Show only top 5 recent activities
  const displayActivities = activities.slice(0, 5);

  return (
    <Card className="shadow-sm border-border h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {displayActivities.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
        ) : (
          <div className="space-y-6">
            {displayActivities.map((activity, index) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative mt-1">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-background z-10 relative">
                    {getActivityIcon(activity.action)}
                  </div>
                  {index !== displayActivities.length - 1 && (
                    <div className="absolute top-8 bottom-[-24px] left-1/2 w-px bg-border -translate-x-1/2" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.details}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)} · by {activity.performedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
