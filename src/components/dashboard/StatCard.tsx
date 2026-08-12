import { Card, CardContent } from '../ui/Card';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  isPositive?: boolean;
  variant?: 'default' | 'blue';
}

export const StatCard = ({ title, value, icon: Icon, trend, isPositive = true, variant = 'default' }: StatCardProps) => {
  return (
    <Card className={cn(
      "border-border shadow-sm",
      variant === 'blue' ? "bg-blue-600 text-white border-blue-600" : "bg-card"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-4">
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            variant === 'blue' ? "bg-white/20 text-white" : "bg-primary/10 text-primary"
          )}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              variant === 'blue' 
                ? "bg-white/20 text-white" 
                : isPositive ? "text-emerald-600 bg-emerald-100" : "text-rose-600 bg-rose-100"
            )}>
              {isPositive ? '+' : ''}{trend}
            </span>
          )}
        </div>
        <div>
          <p className={cn(
            "text-sm font-medium",
            variant === 'blue' ? "text-blue-100" : "text-muted-foreground"
          )}>
            {title}
          </p>
          <h2 className={cn(
            "text-3xl font-bold tracking-tight mt-1",
            variant === 'blue' ? "text-white" : "text-foreground"
          )}>
            {value}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
};
