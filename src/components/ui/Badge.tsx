import * as React from "react"
import { cn } from "../../utils/cn"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'blue' | 'purple';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    success: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80",
    warning: "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-100/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
    blue: "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-100/80",
    purple: "border-transparent bg-purple-100 text-purple-700 hover:bg-purple-100/80",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wide",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
