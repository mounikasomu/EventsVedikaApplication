import React, { useState } from 'react';
import { X, Building2, UserCheck } from 'lucide-react';
import type { VenueItem, VendorItem, VendorCategory, VenueStatus, VendorStatus } from '../../data/vendorVenueTypes';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { toast } from 'sonner';

interface VendorVenueFormModalProps {
  type: 'Venue' | 'Vendor';
  initialData?: VenueItem | VendorItem;
  onClose: () => void;
  onSaveVenue?: (venue: VenueItem) => void;
  onSaveVendor?: (vendor: VendorItem) => void;
}

const vendorCategories: VendorCategory[] = [
  'Catering',
  'Photography',
  'Decoration',
  'Music & DJ',
  'Makeup & Styling',
  'Event Planning',
  'Security & Logistics'
];

export const VendorVenueFormModal: React.FC<VendorVenueFormModalProps> = ({
  type,
  initialData,
  onClose,
  onSaveVenue,
  onSaveVendor
}) => {
  const isVenue = type === 'Venue';
  const venueData = isVenue ? (initialData as VenueItem | undefined) : undefined;
  const vendorData = !isVenue ? (initialData as VendorItem | undefined) : undefined;

  // Venue form state
  const [venueName, setVenueName] = useState(venueData?.name || '');
  const [venueCity, setVenueCity] = useState(venueData?.city || 'Bengaluru');
  const [capacity, setCapacity] = useState(venueData?.capacity || 500);
  const [pricePerDay, setPricePerDay] = useState(venueData?.pricePerDay || 200000);
  const [venueStatus, setVenueStatus] = useState<VenueStatus>(venueData?.status || 'Available');
  const [address, setAddress] = useState(venueData?.address || '');
  const [venueDescription, setVenueDescription] = useState(venueData?.description || '');
  const [amenitiesText, setAmenitiesText] = useState(venueData?.amenities.join(', ') || 'Centralized AC, Valet Parking, Power Backup');
  const [coverImage, setCoverImage] = useState(venueData?.coverImage || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80');

  // Vendor form state
  const [vendorName, setVendorName] = useState(vendorData?.name || '');
  const [category, setCategory] = useState<VendorCategory>(vendorData?.category || 'Catering');
  const [vendorCity, setVendorCity] = useState(vendorData?.city || 'Bengaluru');
  const [startingPrice, setStartingPrice] = useState(vendorData?.startingPrice || 50000);
  const [vendorStatus, setVendorStatus] = useState<VendorStatus>(vendorData?.status || 'Verified');
  const [profilePhoto, setProfilePhoto] = useState(vendorData?.profilePhoto || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80');
  const [bio, setBio] = useState(vendorData?.bio || '');
  const [servicesText, setServicesText] = useState(vendorData?.services.join(', ') || 'Live Counters, Gourmet Plating, VIP Service');

  // Shared contact info
  const [phone, setPhone] = useState(initialData?.contactPhone || '+91 98765 43210');
  const [email, setEmail] = useState(initialData?.contactEmail || 'contact@example.com');
  const [imagesText, setImagesText] = useState(
    isVenue 
      ? venueData?.images.join('\n') || coverImage
      : vendorData?.portfolioImages.join('\n') || profilePhoto
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const imageList = imagesText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (isVenue) {
      if (!venueName.trim()) {
        toast.error('Venue name is required');
        return;
      }
      const newVenue: VenueItem = {
        id: venueData?.id || `vn-${Date.now().toString().slice(-4)}`,
        name: venueName,
        city: venueCity,
        capacity: Number(capacity),
        pricePerDay: Number(pricePerDay),
        rating: venueData?.rating || 4.8,
        description: venueDescription,
        amenities: amenitiesText.split(',').map(s => s.trim()).filter(Boolean),
        coverImage: coverImage || imageList[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        images: imageList.length > 0 ? imageList : [coverImage],
        status: venueStatus,
        contactPhone: phone,
        contactEmail: email,
        address: address
      };
      if (onSaveVenue) onSaveVenue(newVenue);
      toast.success(venueData ? 'Venue updated successfully' : 'New venue added to database');
    } else {
      if (!vendorName.trim()) {
        toast.error('Vendor name is required');
        return;
      }
      const newVendor: VendorItem = {
        id: vendorData?.id || `vd-${Date.now().toString().slice(-4)}`,
        name: vendorName,
        category: category,
        city: vendorCity,
        rating: vendorData?.rating || 4.9,
        startingPrice: Number(startingPrice),
        profilePhoto: profilePhoto || imageList[0] || 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
        portfolioImages: imageList.length > 0 ? imageList : [profilePhoto],
        status: vendorStatus,
        contactPhone: phone,
        contactEmail: email,
        bio: bio,
        services: servicesText.split(',').map(s => s.trim()).filter(Boolean)
      };
      if (onSaveVendor) onSaveVendor(newVendor);
      toast.success(vendorData ? 'Vendor updated successfully' : 'New vendor partner added');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            {isVenue ? <Building2 className="h-5 w-5 text-primary" /> : <UserCheck className="h-5 w-5 text-primary" />}
            <h2 className="text-lg font-bold text-foreground">
              {initialData ? `Edit ${type}` : `Add New ${type}`}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {isVenue ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="venueName" className="text-xs">Venue Name *</Label>
                  <Input 
                    id="venueName" 
                    value={venueName} 
                    onChange={e => setVenueName(e.target.value)} 
                    placeholder="e.g. Royal Crystal Palace & Lawn" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="venueCity" className="text-xs">City</Label>
                  <Input id="venueCity" value={venueCity} onChange={e => setVenueCity(e.target.value)} placeholder="City location" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="venueStatus" className="text-xs">Status</Label>
                  <Select id="venueStatus" value={venueStatus} onChange={e => setVenueStatus(e.target.value as VenueStatus)}>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Under Review">Under Review</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="capacity" className="text-xs">Guest Capacity</Label>
                  <Input id="capacity" type="number" value={capacity} onChange={e => setCapacity(Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pricePerDay" className="text-xs">Price Per Day (₹)</Label>
                  <Input id="pricePerDay" type="number" value={pricePerDay} onChange={e => setPricePerDay(Number(e.target.value))} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs">Full Address</Label>
                <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address or landmark" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="venueDescription" className="text-xs">Description</Label>
                <Textarea id="venueDescription" rows={3} value={venueDescription} onChange={e => setVenueDescription(e.target.value)} placeholder="Overview of venue layout, lighting, acoustic features..." />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="amenitiesText" className="text-xs">Amenities (Comma separated)</Label>
                <Input id="amenitiesText" value={amenitiesText} onChange={e => setAmenitiesText(e.target.value)} placeholder="AC, Valet Parking, Power Backup, Bridal Suite" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="coverImage" className="text-xs">Cover Image URL</Label>
                <Input id="coverImage" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="vendorName" className="text-xs">Vendor Partner / Agency Name *</Label>
                  <Input 
                    id="vendorName" 
                    value={vendorName} 
                    onChange={e => setVendorName(e.target.value)} 
                    placeholder="e.g. Luminary Frame Studios" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category" className="text-xs">Service Category</Label>
                  <Select id="category" value={category} onChange={e => setCategory(e.target.value as VendorCategory)}>
                    {vendorCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vendorCity" className="text-xs">City</Label>
                  <Input id="vendorCity" value={vendorCity} onChange={e => setVendorCity(e.target.value)} placeholder="Operating City" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="startingPrice" className="text-xs">Starting Package Rate (₹)</Label>
                  <Input id="startingPrice" type="number" value={startingPrice} onChange={e => setStartingPrice(Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vendorStatus" className="text-xs">Status</Label>
                  <Select id="vendorStatus" value={vendorStatus} onChange={e => setVendorStatus(e.target.value as VendorStatus)}>
                    <option value="Verified">Verified</option>
                    <option value="Active">Active</option>
                    <option value="Pending Contract">Pending Contract</option>
                    <option value="On Hold">On Hold</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs">Vendor Bio & Track Record</Label>
                <Textarea id="bio" rows={3} value={bio} onChange={e => setBio(e.target.value)} placeholder="Summary of specialties, experience, and awards..." />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="servicesText" className="text-xs">Services Offered (Comma separated)</Label>
                <Input id="servicesText" value={servicesText} onChange={e => setServicesText(e.target.value)} placeholder="Candid Photos, 4K Drone, Pre-wedding Shoot" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profilePhoto" className="text-xs">Profile / Brand Photo URL</Label>
                <Input id="profilePhoto" value={profilePhoto} onChange={e => setProfilePhoto(e.target.value)} placeholder="https://..." />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs">Contact Phone</Label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Contact Email</Label>
              <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="imagesText" className="text-xs">Portfolio Photo URLs (One URL per line)</Label>
            <Textarea 
              id="imagesText" 
              rows={3} 
              value={imagesText} 
              onChange={e => setImagesText(e.target.value)} 
              placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2" 
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
              Save {type} Record
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
