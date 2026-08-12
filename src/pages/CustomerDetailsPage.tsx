import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { useAuth } from '../context/AuthContext';
import { customerService } from '../services/customerService';
import type { Customer, ActivityLog } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { toast } from 'sonner';
import { 
  Printer, Edit, UserPlus, CheckCircle2, Phone, Mail, Globe, Calendar, 
  MapPin, Users, MessageSquare, FileText
} from 'lucide-react';

const getLeadTypeIcon = (type: string) => {
  switch (type) {
    case 'Website': return <Globe className="h-4 w-4 text-muted-foreground mr-2" />;
    case 'Phone Call': return <Phone className="h-4 w-4 text-muted-foreground mr-2" />;
    case 'Referral': return <Users className="h-4 w-4 text-muted-foreground mr-2" />;
    default: return <FileText className="h-4 w-4 text-muted-foreground mr-2" />;
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

export const CustomerDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  useEffect(() => {
    if (user && id) {
      const data = customerService.getCustomerById(id, user);
      if (data) {
        setCustomer(data);
        setActivities(customerService.getActivitiesForCustomer(id));
      } else {
        // Handle not found or unauthorized
        navigate('/customers');
      }
    }
  }, [id, user, navigate]);

  if (!customer) return null;

  const initials = customer.customerName.substring(0, 2).toUpperCase();
  const createdDateStr = new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const eventDateStr = new Date(customer.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const daysAgo = Math.floor((new Date().getTime() - new Date(customer.createdAt).getTime()) / (1000 * 3600 * 24));
  
  const managerNames: Record<string, string> = { '2': 'Shivani L.', '3': 'Siddhi M.', '4': 'Basava K.' };
  const managerName = customer.assignedTo ? (managerNames[customer.assignedTo] || 'Admin') : 'Unassigned';

  const isHotLead = customer.leadType === 'Referral' || customer.leadType === 'Website';

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header Section */}
        <div>
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
            <span className="mx-2">›</span>
            <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/customers')}>Customers</span>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">{customer.customerName}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  {customer.customerName}
                </h1>
                {isHotLead && <Badge variant="warning" className="text-[10px] bg-orange-100 text-orange-600">🔥 HOT LEAD</Badge>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Lead ID: #{customer.id.toUpperCase()} · Submitted {daysAgo === 0 ? 'today' : `${daysAgo} days ago`}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9 px-3 gap-2 bg-white">
                <Printer className="h-4 w-4" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button variant="outline" className="h-9 px-3 gap-2 bg-white" onClick={() => navigate(`/customers/${customer.id}/edit`)}>
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Edit</span>
              </Button>
              {user?.role === 'Admin' && (
                <Button 
                  className="h-9 px-3 gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => navigate(`/customers/${customer.id}/assign`)}
                >
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">Assign</span>
                </Button>
              )}
              <Button 
                className="h-9 px-3 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  if (user) {
                    customerService.updateCustomer(customer.id, { status: 'Closed' }, user);
                    toast.success('Lead has been closed successfully');
                    navigate('/customers');
                  }
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="hidden sm:inline">Close Lead</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Status Stepper */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between relative max-w-3xl mx-auto">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-muted -z-10"></div>
              
              {/* Stepper logic */}
              {['New', 'In Progress', 'Closed'].map((step, idx) => {
                const statuses = ['New', 'In Progress', 'Closed'];
                const currentIndex = statuses.indexOf(customer.status);
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step} className="flex flex-col items-center bg-card px-4">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 mb-2 ${
                      isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-muted border-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span>{idx + 1}</span>}
                    </div>
                    <span className={`text-xs font-semibold ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 2-Column Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Profile, Event Details, Assigned Manager) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Customer Profile Card */}
            <Card className="border-border shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 border-b border-border pb-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{customer.customerName}</h3>
                    <p className="text-xs text-muted-foreground font-medium">VIP Client</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-2" /> Email
                    </p>
                    <p className="text-sm font-medium pl-6">{customer.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center mb-1">
                      <Phone className="h-4 w-4 mr-2" /> Phone
                    </p>
                    <p className="text-sm font-medium pl-6">{customer.phoneNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center mb-1">
                      {getLeadTypeIcon(customer.leadType)} Lead Source
                    </p>
                    <p className="text-sm font-medium pl-6">{customer.leadType} Inquiry</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center mb-1">
                      <Calendar className="h-4 w-4 mr-2" /> Created Date
                    </p>
                    <p className="text-sm font-medium pl-6">{createdDateStr}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Details Card (Blue) */}
            <Card className="bg-[#0f52ba] text-white shadow-sm border-none">
              <CardHeader className="pb-2 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-white">Event Details</CardTitle>
                  <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-white/20" onClick={() => navigate(`/customers/${customer.id}/edit`)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-white/70 text-xs font-medium mb-1">Type</p>
                    <p className="font-semibold text-sm">{customer.eventType}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-medium mb-1">Guests</p>
                    <p className="font-semibold text-sm">{customer.guestCount} Pax</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-medium mb-1">Date</p>
                    <p className="font-semibold text-sm">{eventDateStr}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-medium mb-1">Budget</p>
                    <p className="font-semibold text-sm">${customer.revenue.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-white/20">
                    <p className="text-white/70 text-xs font-medium mb-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> Location
                    </p>
                    <p className="font-semibold text-sm">{customer.eventLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Manager Card */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Assigned Manager
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                    {managerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{managerName}</p>
                    <p className="text-xs text-muted-foreground">Senior Event Manager</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="w-full text-xs h-8 gap-2 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                    <MessageSquare className="h-3 w-3" /> Chat
                  </Button>
                  <Button variant="outline" className="w-full text-xs h-8 gap-2 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100">
                    <Mail className="h-3 w-3" /> Email
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column (Notes/Timeline, Documents) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Enquiry & Notes (Activity Timeline) */}
            <Card className="border-border shadow-sm h-auto min-h-[400px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                <CardTitle className="text-lg font-semibold">Enquiry & Notes</CardTitle>
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium px-2 py-1 h-auto">
                  + New Note
                </Button>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <div className="mb-8">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Initial Enquiry</p>
                  <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-md text-sm italic text-gray-700">
                    "{customer.description || `We are looking to host a ${customer.eventType.toLowerCase()} for approximately ${customer.guestCount} guests at ${customer.eventLocation}.`}"
                  </div>
                </div>

                <div className="space-y-6">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                        {activity.performedBy.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold">{activity.performedBy}</p>
                          <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-medium text-foreground">{activity.action}</span> - {activity.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

      </div>
    </AppLayout>
  );
};
