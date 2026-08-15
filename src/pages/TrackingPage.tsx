import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { vendorVenueService } from '../services/vendorVenueService';
import type { TrackingLog, TrackingStage } from '../data/vendorVenueTypes';
import { TrackingStatusModal } from '../components/tracking/TrackingStatusModal';

import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { 
  Clock, Search, Plus, Building2, UserCheck, Calendar, 
  ArrowRight, Trash2, Edit 
} from 'lucide-react';
import { toast } from 'sonner';

const stages: TrackingStage[] = [
  'Inquiry',
  'Contract Sent',
  'Deposit Paid',
  'Confirmed',
  'Completed',
  'Cancelled'
];

const stageColorMap: Record<TrackingStage, { bg: string; border: string; text: string; headerBg: string }> = {
  'Inquiry': { bg: 'bg-blue-50/50', border: 'border-blue-200', text: 'text-blue-700', headerBg: 'bg-blue-100/70' },
  'Contract Sent': { bg: 'bg-purple-50/50', border: 'border-purple-200', text: 'text-purple-700', headerBg: 'bg-purple-100/70' },
  'Deposit Paid': { bg: 'bg-amber-50/50', border: 'border-amber-200', text: 'text-amber-700', headerBg: 'bg-amber-100/70' },
  'Confirmed': { bg: 'bg-emerald-50/50', border: 'border-emerald-200', text: 'text-emerald-700', headerBg: 'bg-emerald-100/70' },
  'Completed': { bg: 'bg-teal-50/50', border: 'border-teal-200', text: 'text-teal-700', headerBg: 'bg-teal-100/70' },
  'Cancelled': { bg: 'bg-red-50/50', border: 'border-red-200', text: 'text-red-700', headerBg: 'bg-red-100/70' },
};

export const TrackingPage = () => {
  const [logs, setLogs] = useState<TrackingLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState<'All' | 'Venue' | 'Vendor'>('All');
  const [activeEditLog, setActiveEditLog] = useState<TrackingLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLogs(vendorVenueService.getTrackingLogs());
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.notes.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = targetTypeFilter === 'All' || log.targetType === targetTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [logs, searchQuery, targetTypeFilter]);

  const logsByStage = useMemo(() => {
    const map: Record<TrackingStage, TrackingLog[]> = {
      'Inquiry': [],
      'Contract Sent': [],
      'Deposit Paid': [],
      'Confirmed': [],
      'Completed': [],
      'Cancelled': []
    };
    filteredLogs.forEach(log => {
      if (map[log.stage]) {
        map[log.stage].push(log);
      }
    });
    return map;
  }, [filteredLogs]);

  const pipelineValue = useMemo(() => {
    return filteredLogs.reduce((sum, log) => sum + (log.stage !== 'Cancelled' ? log.amount : 0), 0);
  }, [filteredLogs]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove the tracking record for ${name}?`)) {
      vendorVenueService.deleteTrackingLog(id);
      loadLogs();
      toast.success('Tracking record deleted');
    }
  };

  const handleStageAdvance = (log: TrackingLog) => {
    const currentIndex = stages.indexOf(log.stage);
    if (currentIndex < stages.length - 2) { // Skip advance if completed/cancelled
      const nextStage = stages[currentIndex + 1];
      vendorVenueService.updateTrackingStage(log.id, nextStage);
      loadLogs();
      toast.success(`Advanced ${log.targetName} to ${nextStage}`);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Booking & Contract Pipeline</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Track real-time progress for venue hires and vendor contracts across event stages.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-card border border-border px-4 py-2 rounded-xl text-right shadow-sm">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">Active Pipeline Value</span>
              <div className="text-lg font-extrabold text-primary">₹{pipelineValue.toLocaleString()}</div>
            </div>
            <Button 
              onClick={() => { setActiveEditLog(null); setIsModalOpen(true); }}
              className="gap-2 bg-primary text-primary-foreground font-semibold shadow-md"
            >
              <Plus className="h-4 w-4" /> New Track Log
            </Button>
          </div>
        </div>

        {/* Filter Controls */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative sm:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by client, venue, or vendor name..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div>
                <Select value={targetTypeFilter} onChange={e => setTargetTypeFilter(e.target.value as 'All' | 'Venue' | 'Vendor')}>
                  <option value="All">All Types (Venues & Vendors)</option>
                  <option value="Venue">Venues Only</option>
                  <option value="Vendor">Vendors Only</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-start">
          {stages.map(stage => {
            const stageLogs = logsByStage[stage];
            const colors = stageColorMap[stage];

            return (
              <div key={stage} className={`rounded-xl border ${colors.border} ${colors.bg} p-3 min-h-[500px] flex flex-col`}>
                {/* Column Header */}
                <div className={`flex items-center justify-between p-2.5 rounded-lg ${colors.headerBg} mb-3`}>
                  <h3 className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                    {stage}
                  </h3>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/80 ${colors.text}`}>
                    {stageLogs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageLogs.map(log => (
                    <Card key={log.id} className="border-border shadow-sm hover:shadow-md transition-all bg-card">
                      <CardContent className="p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded ${
                            log.targetType === 'Venue' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'
                          }`}>
                            {log.targetType === 'Venue' ? <Building2 className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                            {log.targetType}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(log.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-foreground line-clamp-1">{log.targetName}</h4>
                          <p className="text-[11px] font-medium text-primary mt-0.5 flex items-center gap-1">
                            {log.customerName}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" /> {log.eventDate}
                          </span>
                          <span className="font-extrabold text-foreground">
                            ₹{log.amount.toLocaleString()}
                          </span>
                        </div>

                        {log.notes && (
                          <p className="text-[10px] text-muted-foreground bg-muted/50 p-1.5 rounded line-clamp-2 italic">
                            "{log.notes}"
                          </p>
                        )}

                        {/* Card Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => { setActiveEditLog(log); setIsModalOpen(true); }}
                              className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                              title="Edit Log"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(log.id, log.targetName)}
                              className="p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                              title="Delete Log"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {stage !== 'Completed' && stage !== 'Cancelled' && (
                            <button 
                              onClick={() => handleStageAdvance(log)}
                              className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-0.5"
                            >
                              Next Stage <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {stageLogs.length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground border border-dashed border-border rounded-lg">
                      No bookings in stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tracking Status Modal */}
        {isModalOpen && (
          <TrackingStatusModal 
            log={activeEditLog || undefined}
            onClose={() => { setIsModalOpen(false); setActiveEditLog(null); }}
            onSave={(log) => {
              vendorVenueService.saveTrackingLog(log);
              loadLogs();
            }}
          />
        )}
      </div>
    </AppLayout>
  );
};
