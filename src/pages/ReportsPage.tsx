import { useState, useEffect } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Download, Users, CheckCircle2, RefreshCw, BarChart2, Hash, Star } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export const ReportsPage = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState('All Time');
  const [status, setStatus] = useState('All');
  const [eventType, setEventType] = useState('All');
  const [leadType, setLeadType] = useState('All');
  const [assignedTo, setAssignedTo] = useState('All');

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      // Simulate network request
      setTimeout(() => {
        const filters = { dateRange, status, eventType, leadType, assignedTo };
        const data = customerService.getReportMetrics(user, filters);
        setMetrics(data);
        setIsLoading(false);
      }, 300);
    }
  }, [user, dateRange, status, eventType, leadType, assignedTo]);

  if (!user) return null;

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Reports Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Analyze your event management performance and lead conversion.
            </p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Filters Bar */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Filter Options
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Time Period</label>
                <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="All Time">All Time</option>
                  <option value="This Month">This Month</option>
                  <option value="Last Month">Last Month</option>
                  <option value="This Year">This Year</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Event Type</label>
                <Select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  <option value="All">All Event Types</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Social">Social</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Lead Source</label>
                <Select value={leadType} onChange={(e) => setLeadType(e.target.value)}>
                  <option value="All">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="Phone Call">Phone Call</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-In">Walk-In</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Manager</label>
                <Select 
                  value={assignedTo} 
                  onChange={(e) => setAssignedTo(e.target.value)}
                  disabled={user.role === 'Event Manager'}
                >
                  <option value="All">All Managers</option>
                  <option value="unassigned">Unassigned</option>
                  <option value="2">Shivani L.</option>
                  <option value="3">Siddhi M.</option>
                  <option value="4">Basava K.</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 animate-pulse">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-28 bg-muted rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <StatCard title="Total Leads" value={metrics?.kpis.totalLeads || 0} icon={Users} />
            <StatCard title="Closed Leads" value={metrics?.kpis.closedLeads || 0} icon={CheckCircle2} />
            <StatCard title="Open Leads" value={metrics?.kpis.openLeads || 0} icon={RefreshCw} />
            <StatCard title="Conversion Rate" value={metrics?.kpis.conversionRate || '0%'} icon={BarChart2} />
            <StatCard title="Avg Guest Count" value={metrics?.kpis.averageGuestCount || 0} icon={Hash} />
            <StatCard title="Top Event Type" value={metrics?.kpis.mostPopularEventType || 'N/A'} icon={Star} variant="blue" />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Monthly Trend */}
          <Card className="col-span-1 lg:col-span-2 border-border shadow-sm">
            <CardHeader className="pb-2 border-b border-border">
              <CardTitle className="text-base font-semibold">Monthly Lead Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[300px]">
              {isLoading ? <div className="w-full h-full bg-muted animate-pulse rounded" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics?.charts.monthlyLeadsData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="value" name="Leads" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2 border-b border-border">
              <CardTitle className="text-base font-semibold">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[250px]">
              {isLoading ? <div className="w-full h-full bg-muted animate-pulse rounded" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics?.charts.statusDistribution || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {(metrics?.charts.statusDistribution || []).map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Event Type Distribution */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-2 border-b border-border">
              <CardTitle className="text-base font-semibold">Event Types</CardTitle>
            </CardHeader>
            <CardContent className="p-4 h-[250px]">
              {isLoading ? <div className="w-full h-full bg-muted animate-pulse rounded" /> : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.charts.eventTypeDistribution || []} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} width={100} />
                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                      {(metrics?.charts.eventTypeDistribution || []).map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          {/* Manager Distribution (Admin Only) */}
          {user.role === 'Admin' && (
            <Card className="col-span-1 lg:col-span-2 border-border shadow-sm">
              <CardHeader className="pb-2 border-b border-border">
                <CardTitle className="text-base font-semibold">Assigned Leads by Manager</CardTitle>
              </CardHeader>
              <CardContent className="p-4 h-[250px]">
                {isLoading ? <div className="w-full h-full bg-muted animate-pulse rounded" /> : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics?.charts.leadsByManager || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          )}

        </div>

        {/* Summary Table */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3 border-b border-border bg-muted/20">
            <CardTitle className="text-base font-semibold">Performance Summary Table</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-medium">Manager</th>
                    <th className="px-6 py-4 font-medium text-center">Assigned Leads</th>
                    <th className="px-6 py-4 font-medium text-center text-green-600">Completed (Closed)</th>
                    <th className="px-6 py-4 font-medium text-center text-amber-600">Pending</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    [1,2,3].map(i => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-12 mx-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-12 mx-auto"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-muted animate-pulse rounded w-12 mx-auto"></div></td>
                      </tr>
                    ))
                  ) : metrics?.summaryTable.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        No data available for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    (metrics?.summaryTable || []).map((row: any, i: number) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{row.manager}</td>
                        <td className="px-6 py-4 text-center font-semibold">{row.assignedLeads}</td>
                        <td className="px-6 py-4 text-center font-semibold text-green-600">{row.completedLeads}</td>
                        <td className="px-6 py-4 text-center font-semibold text-amber-600">{row.pendingLeads}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
};
