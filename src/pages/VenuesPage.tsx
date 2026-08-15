import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { vendorVenueService } from '../services/vendorVenueService';
import type { VenueItem, VenueStatus } from '../data/vendorVenueTypes';
import { VenueLightboxModal } from '../components/venues/VenueLightboxModal';
import { VendorVenueFormModal } from '../components/vendorVenue/VendorVenueFormModal';
import { TrackingStatusModal } from '../components/tracking/TrackingStatusModal';

import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { 
  Building2, Search, MapPin, Users, Star, Plus, Eye, Clock, 
  Edit, Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

export const VenuesPage = () => {
  const [venues, setVenues] = useState<VenueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [minCapacity, setMinCapacity] = useState<number>(0);

  // Modals
  const [activeLightboxVenue, setActiveLightboxVenue] = useState<VenueItem | null>(null);
  const [activeEditVenue, setActiveEditVenue] = useState<VenueItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeTrackingTarget, setActiveTrackingTarget] = useState<{
    id: string;
    type: 'Venue' | 'Vendor';
    name: string;
    suggestedAmount: number;
  } | null>(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = () => {
    setVenues(vendorVenueService.getVenues());
  };

  const cities = useMemo(() => {
    const list = Array.from(new Set(venues.map(v => v.city)));
    return ['All', ...list];
  }, [venues]);

  const filteredVenues = useMemo(() => {
    return venues.filter(venue => {
      const matchesSearch = 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCity = selectedCity === 'All' || venue.city === selectedCity;
      const matchesStatus = selectedStatus === 'All' || venue.status === selectedStatus;
      const matchesCapacity = venue.capacity >= minCapacity;

      return matchesSearch && matchesCity && matchesStatus && matchesCapacity;
    });
  }, [venues, searchQuery, selectedCity, selectedStatus, minCapacity]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the database?`)) {
      vendorVenueService.deleteVenue(id);
      loadVenues();
      toast.success(`${name} removed`);
    }
  };

  const getStatusBadge = (status: VenueStatus) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Available</Badge>;
      case 'Booked':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">Booked</Badge>;
      case 'Maintenance':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Maintenance</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Under Review</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Venues Database</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Explore luxury banquet halls, resort lawns, and convention centers with real photos and tracking.
            </p>
          </div>

          <Button 
            onClick={() => { setActiveEditVenue(null); setIsFormModalOpen(true); }}
            className="gap-2 bg-primary text-primary-foreground font-semibold shadow-md"
          >
            <Plus className="h-4 w-4" /> Add New Venue
          </Button>
        </div>

        {/* Filters Card */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search venue by name, city..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div>
                <Select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                  {cities.map(city => (
                    <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                  <option value="All">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Under Review">Under Review</option>
                </Select>
              </div>

              <div>
                <Select value={minCapacity.toString()} onChange={e => setMinCapacity(Number(e.target.value))}>
                  <option value="0">Any Capacity</option>
                  <option value="500">500+ Guests</option>
                  <option value="1000">1000+ Guests</option>
                  <option value="2000">2000+ Guests</option>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venues Grid */}
        {filteredVenues.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No venues match your filter</h3>
            <p className="text-sm text-muted-foreground mt-1">Try resetting search keywords or city selection.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => (
              <Card key={venue.id} className="group border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                {/* Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => setActiveLightboxVenue(venue)}>
                  <img 
                    src={venue.coverImage} 
                    alt={venue.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {getStatusBadge(venue.status)}
                    <span className="bg-slate-900/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-amber-400/30">
                      <Star className="h-3.5 w-3.5 fill-amber-400" /> {venue.rating}
                    </span>
                  </div>

                  {/* Overlay Trigger Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveLightboxVenue(venue); }}
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 transition-all transform hover:scale-105"
                  >
                    <Eye className="h-3.5 w-3.5 text-purple-600" /> {venue.images.length} Photos
                  </button>
                </div>

                {/* Card Body */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {venue.city}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> {venue.capacity.toLocaleString()} Pax</span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                      {venue.description}
                    </p>

                    {/* Amenities Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {venue.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="inline-flex items-center text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities.length > 3 && (
                        <span className="text-[10px] text-muted-foreground px-1 py-0.5">
                          +{venue.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Footer Actions */}
                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-muted-foreground">Daily Rate</span>
                      <div className="text-base font-bold text-foreground">
                        ₹{venue.pricePerDay.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveTrackingTarget({
                            id: venue.id,
                            type: 'Venue',
                            name: venue.name,
                            suggestedAmount: venue.pricePerDay
                          });
                        }}
                        className="h-8 px-2.5 text-xs gap-1"
                        title="Track Booking Pipeline"
                      >
                        <Clock className="h-3.5 w-3.5 text-primary" /> Track
                      </Button>

                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => { setActiveEditVenue(venue); setIsFormModalOpen(true); }}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                      </Button>

                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(venue.id, venue.name)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {activeLightboxVenue && (
          <VenueLightboxModal 
            venue={activeLightboxVenue} 
            onClose={() => setActiveLightboxVenue(null)} 
            onTrackBooking={(v) => {
              setActiveTrackingTarget({
                id: v.id,
                type: 'Venue',
                name: v.name,
                suggestedAmount: v.pricePerDay
              });
            }}
          />
        )}

        {/* Form Modal */}
        {isFormModalOpen && (
          <VendorVenueFormModal 
            type="Venue"
            initialData={activeEditVenue || undefined}
            onClose={() => { setIsFormModalOpen(false); setActiveEditVenue(null); }}
            onSaveVenue={() => { loadVenues(); }}
          />
        )}

        {/* Tracking Status Modal */}
        {activeTrackingTarget && (
          <TrackingStatusModal 
            initialTarget={activeTrackingTarget}
            onClose={() => setActiveTrackingTarget(null)}
            onSave={(log) => {
              vendorVenueService.saveTrackingLog(log);
            }}
          />
        )}
      </div>
    </AppLayout>
  );
};
