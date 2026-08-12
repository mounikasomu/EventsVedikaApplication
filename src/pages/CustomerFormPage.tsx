import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';
import type { Customer } from '../data/mockData';

import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Select } from '../components/ui/Select';
import { Textarea } from '../components/ui/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ArrowLeft, User, PartyPopper, TrendingUp, Info } from 'lucide-react';
import { toast } from 'sonner';

const customerSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().min(10, 'Valid phone number is required'),
  eventType: z.string().min(1, 'Event type is required'),
  guestCount: z.coerce.number().min(1, 'Guest count must be at least 1'),
  eventLocation: z.string().min(2, 'Location is required'),
  eventDate: z.string().min(1, 'Event date is required'),
  leadType: z.string().min(1, 'Lead source is required'),
  status: z.string().min(1, 'Status is required'),
  assignedTo: z.string().min(1, 'Assignee is required'),
  description: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export const CustomerFormPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      customerName: '',
      email: '',
      phoneNumber: '',
      eventType: '',
      guestCount: 0,
      eventLocation: '',
      eventDate: '',
      leadType: 'Website',
      status: 'New',
      assignedTo: user?.role === 'Event Manager' ? user.id : 'unassigned',
      description: '',
    },
  });

  useEffect(() => {
    if (isEditMode && id && user) {
      const customer = customerService.getCustomerById(id, user);
      if (customer) {
        // Strip out non-form properties when resetting, or simply cast it
        reset({
          customerName: customer.customerName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          eventType: customer.eventType,
          guestCount: customer.guestCount,
          eventLocation: customer.eventLocation,
          eventDate: customer.eventDate,
          leadType: customer.leadType,
          status: customer.status,
          assignedTo: customer.assignedTo || 'unassigned',
          description: customer.description || '',
        });
      } else {
        toast.error('Customer not found or unauthorized');
        navigate('/customers');
      }
    }
  }, [id, isEditMode, user, reset, navigate]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleCancel = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        return;
      }
    }
    navigate(isEditMode ? `/customers/${id}` : '/customers');
  };

  const onSubmit = (data: CustomerFormValues, isSaveAndNew: boolean) => {
    if (!user) return;
    
    try {
      if (isEditMode && id) {
        customerService.updateCustomer(id, data as Partial<Customer>, user);
        toast.success('Customer updated successfully!');
        navigate(`/customers/${id}`);
      } else {
        customerService.addCustomer(data as Partial<Customer>, user);
        toast.success('Customer saved successfully!');
        if (isSaveAndNew) {
          reset();
        } else {
          navigate('/customers');
        }
      }
    } catch (error) {
      toast.error('Failed to save customer');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        {/* Header */}
        <div>
          <button 
            onClick={handleCancel}
            type="button"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Customers
          </button>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <span>Dashboard</span>
            <span className="mx-2">›</span>
            <span>Customers</span>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{isEditMode ? 'Edit Record' : 'New Record'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h1>
        </div>

        <form id="customer-form" className="space-y-6">
          {/* Personal Information */}
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-blue-600">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName" className="text-xs">Customer Name <span className="text-destructive">*</span></Label>
                  <Input id="customerName" placeholder="Enter full name" {...register('customerName')} />
                  {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs">Email Address <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" placeholder="alex@example.com" {...register('email')} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-xs">Phone Number <span className="text-destructive">*</span></Label>
                  <Input id="phoneNumber" placeholder="+1 (555) 000-0000" {...register('phoneNumber')} />
                  {errors.phoneNumber && <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-blue-600">
                <PartyPopper className="h-4 w-4" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="eventType" className="text-xs">Event Type <span className="text-destructive">*</span></Label>
                  <Select id="eventType" {...register('eventType')}>
                    <option value="">Select event type</option>
                    <option value="Marriage">Marriage</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Bachelor Party">Bachelor Party</option>
                    <option value="Reception">Reception</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Other">Other</option>
                  </Select>
                  {errors.eventType && <p className="text-xs text-destructive">{errors.eventType.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="text-xs">Guest Count <span className="text-destructive">*</span></Label>
                  <Input id="guestCount" type="number" placeholder="0" {...register('guestCount')} />
                  {errors.guestCount && <p className="text-xs text-destructive">{errors.guestCount.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventLocation" className="text-xs">Event Location <span className="text-destructive">*</span></Label>
                  <Input id="eventLocation" placeholder="Grand Ballroom, Downtown" {...register('eventLocation')} />
                  {errors.eventLocation && <p className="text-xs text-destructive">{errors.eventLocation.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-xs">Event Date <span className="text-destructive">*</span></Label>
                  <Input id="eventDate" type="date" {...register('eventDate')} />
                  {errors.eventDate && <p className="text-xs text-destructive">{errors.eventDate.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Management */}
          <Card className="border-border shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                Lead Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="leadType" className="text-xs">Lead Source</Label>
                  <Select id="leadType" {...register('leadType')}>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Walk-In">Walk-In</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Social Media">Social Media</option>
                  </Select>
                  {errors.leadType && <p className="text-xs text-destructive">{errors.leadType.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-xs">Initial Status</Label>
                  <Select id="status" {...register('status')}>
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </Select>
                  {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo" className="text-xs">Assign To</Label>
                  <Select 
                    id="assignedTo" 
                    {...register('assignedTo')} 
                    disabled={user?.role === 'Event Manager'}
                    className={user?.role === 'Event Manager' ? 'bg-muted' : ''}
                  >
                    <option value="unassigned">Unassigned</option>
                    <option value="2">Shivani L.</option>
                    <option value="3">Siddhi M.</option>
                    <option value="4">Basava K.</option>
                  </Select>
                  {errors.assignedTo && <p className="text-xs text-destructive">{errors.assignedTo.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs">Description / Special Requirements</Label>
                <Textarea 
                  id="description" 
                  placeholder="Add any additional notes about the customer or their event vision..." 
                  className="min-h-[120px]"
                  {...register('description')} 
                />
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Form Actions */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-4">
          <div className="flex items-center text-sm text-amber-600 font-medium">
            <Info className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>All changes are auto-saved to drafts</span>
          </div>
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            {!isEditMode && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full sm:w-auto text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={handleSubmit((data) => onSubmit(data, true))}
                disabled={isSubmitting}
              >
                Save & New
              </Button>
            )}
            <Button 
              type="button" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit((data) => onSubmit(data, false))}
              disabled={isSubmitting}
            >
              {isEditMode ? 'Update Customer' : 'Save Customer'}
            </Button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
