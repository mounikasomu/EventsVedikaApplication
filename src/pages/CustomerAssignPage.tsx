import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';
import type { Customer, ActivityLog } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { ArrowLeft, UserPlus, History, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const assignSchema = z.object({
  assignedTo: z.string().min(1, 'Assignee is required'),
  priority: z.string().min(1, 'Priority is required'),
  status: z.string().min(1, 'Status is required'),
  notes: z.string().min(2, 'Assignment notes are required'),
});

type AssignFormValues = z.infer<typeof assignSchema>;

export const CustomerAssignPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [history, setHistory] = useState<ActivityLog[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      assignedTo: user?.role === 'Event Manager' ? user.id : 'unassigned',
      priority: 'Medium',
      status: 'New',
      notes: '',
    },
  });

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      toast.error('Only Admins can assign leads');
      navigate('/customers');
      return;
    }

    if (user && id) {
      const data = customerService.getCustomerById(id, user);
      if (data) {
        setCustomer(data);
        if (data.assignedTo && user.role !== 'Event Manager') {
          setValue('assignedTo', data.assignedTo);
        }
        if (data.priority) {
          setValue('priority', data.priority);
        }
        setValue('status', data.status);
        
        // Fetch only assignment-related history
        const allActivities = customerService.getActivitiesForCustomer(id);
        const assignActivities = allActivities.filter(a => 
          a.action === 'Lead Assigned' || a.action === 'Customer Created'
        );
        setHistory(assignActivities);
      } else {
        toast.error('Customer not found');
        navigate('/customers');
      }
    }
  }, [id, user, navigate, setValue]);

  const onSubmit = (data: AssignFormValues) => {
    if (!user || !id) return;
    
    try {
      customerService.assignCustomer(id, data.assignedTo, data.priority, data.status, data.notes, user);
      toast.success('Lead successfully assigned!');
      navigate(`/customers/${id}`);
    } catch (error) {
      toast.error('Failed to assign lead');
    }
  };

  if (!customer) return null;

  const managerNames: Record<string, string> = { '2': 'Shivani L.', '3': 'Siddhi M.', '4': 'Basava K.' };
  const currentManagerName = customer.assignedTo ? (managerNames[customer.assignedTo] || 'Admin') : 'Unassigned';

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header Section */}
        <div>
          <button 
            onClick={() => navigate(`/customers/${id}`)}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Customer Details
          </button>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <span>Dashboard</span>
            <span className="mx-2">›</span>
            <span>Customers</span>
            <span className="mx-2">›</span>
            <span>{customer.customerName}</span>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Assign Lead</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-purple-600" />
            Assign Lead
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Summary Card */}
            <Card className="border-border shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-blue-100">
                  <h3 className="font-semibold text-lg text-blue-900">{customer.customerName}</h3>
                  <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {customer.status}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600/70 font-medium mb-1">Event Type</p>
                    <p className="text-sm font-semibold text-blue-900">{customer.eventType} ({customer.guestCount} Guests)</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600/70 font-medium mb-1">Current Assignee</p>
                    <p className="text-sm font-semibold text-blue-900 flex items-center">
                      <Briefcase className="h-3 w-3 mr-1" /> {currentManagerName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assignment Form */}
            <Card className="border-border shadow-sm">
              <CardHeader className="bg-muted/30 border-b border-border pb-4">
                <CardTitle className="text-base font-semibold">Assignment Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form id="assign-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo" className="text-xs">Assign To <span className="text-destructive">*</span></Label>
                      <Select 
                        id="assignedTo" 
                        {...register('assignedTo')} 
                        disabled={user?.role === 'Event Manager'}
                        className={user?.role === 'Event Manager' ? 'bg-muted font-medium' : ''}
                      >
                        <option value="unassigned" disabled>Select Manager</option>
                        <option value="2">Shivani L. (Manager)</option>
                        <option value="3">Siddhi M. (Manager)</option>
                        <option value="4">Basava K. (Manager)</option>
                      </Select>
                      {errors.assignedTo && <p className="text-xs text-destructive">{errors.assignedTo.message}</p>}
                      {user?.role === 'Event Manager' && (
                        <p className="text-[10px] text-muted-foreground mt-1">Managers can only assign leads to themselves.</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-xs">Priority <span className="text-destructive">*</span></Label>
                      <Select id="priority" {...register('priority')}>
                        <option value="Low">Low Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="High">High Priority</option>
                      </Select>
                      {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-xs">Status <span className="text-destructive">*</span></Label>
                      <Select id="status" {...register('status')}>
                        <option value="New">New</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                      </Select>
                      {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-xs">Assignment Notes <span className="text-destructive">*</span></Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Add context or instructions for the event manager..." 
                      className="min-h-[120px]"
                      {...register('notes')} 
                    />
                    {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-border">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate(`/customers/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={isSubmitting}
                    >
                      Assign Lead
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-1">
            <Card className="border-border shadow-sm h-full">
              <CardHeader className="border-b border-border pb-4 bg-muted/10">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  Assignment History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {history.map((activity) => (
                    <div key={activity.id} className="relative pl-6 pb-2 last:pb-0">
                      <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-purple-500 ring-4 ring-purple-100"></div>
                      {history.length > 1 && <div className="absolute left-1 top-4 bottom-[-1.5rem] w-[1px] bg-border last:hidden"></div>}
                      
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{activity.action}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">By {activity.performedBy}</p>
                      {activity.details && (
                        <p className="text-xs text-gray-700 bg-muted/30 p-2 rounded mt-1">
                          {activity.details}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {history.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No assignment history found.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
};
