import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import type { TrackingLog, TrackingStage } from '../../data/vendorVenueTypes';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { toast } from 'sonner';

interface TrackingStatusModalProps {
  log?: TrackingLog;
  initialTarget?: {
    id: string;
    type: 'Venue' | 'Vendor';
    name: string;
    suggestedAmount: number;
  };
  onClose: () => void;
  onSave: (log: TrackingLog) => void;
}

const trackingStages: TrackingStage[] = [
  'Inquiry',
  'Contract Sent',
  'Deposit Paid',
  'Confirmed',
  'Completed',
  'Cancelled'
];

export const TrackingStatusModal: React.FC<TrackingStatusModalProps> = ({
  log,
  initialTarget,
  onClose,
  onSave
}) => {
  const [customerName, setCustomerName] = useState(log?.customerName || 'New Client Booking');
  const [eventDate, setEventDate] = useState(log?.eventDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
  const [stage, setStage] = useState<TrackingStage>(log?.stage || 'Inquiry');
  const [amount, setAmount] = useState(log?.amount || initialTarget?.suggestedAmount || 100000);
  const [notes, setNotes] = useState(log?.notes || 'Initial booking inquiry logged into system pipeline.');

  const targetName = log?.targetName || initialTarget?.name || 'Selected Booking Partner';
  const targetType = log?.targetType || initialTarget?.type || 'Venue';
  const targetId = log?.targetId || initialTarget?.id || 'target-001';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error('Customer/Client name is required');
      return;
    }

    const updatedLog: TrackingLog = {
      id: log?.id || `tr-${Date.now().toString().slice(-4)}`,
      targetId,
      targetType,
      targetName,
      customerName,
      eventDate,
      stage,
      amount: Number(amount),
      notes,
      updatedAt: new Date().toISOString()
    };

    onSave(updatedLog);
    toast.success(`Booking track for ${targetName} updated to stage: ${stage}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-base font-bold text-foreground">
                {log ? 'Update Stage Track' : 'Initiate New Booking Track'}
              </h2>
              <p className="text-xs text-muted-foreground">{targetType}: {targetName}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="customerName" className="text-xs">Client / Customer / Event Name *</Label>
            <Input 
              id="customerName" 
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)} 
              placeholder="e.g. Ananya & Rahul Wedding"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="stage" className="text-xs">Booking Stage *</Label>
              <Select id="stage" value={stage} onChange={e => setStage(e.target.value as TrackingStage)}>
                {trackingStages.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="eventDate" className="text-xs">Scheduled Event Date</Label>
              <Input id="eventDate" type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs">Contract / Package Deal Value (₹)</Label>
            <Input id="amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs">Pipeline Activity & Status Notes</Label>
            <Textarea 
              id="notes" 
              rows={3} 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter stage updates, advance payment receipts, or agreement status..."
            />
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
              Save Stage Track
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
