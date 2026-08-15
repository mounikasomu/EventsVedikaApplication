import { useState, useEffect, useMemo } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { vendorVenueService } from '../services/vendorVenueService';
import type { VendorItem, VendorCategory, VendorStatus } from '../data/vendorVenueTypes';
import { VendorPortfolioModal } from '../components/vendors/VendorPortfolioModal';
import { VendorVenueFormModal } from '../components/vendorVenue/VendorVenueFormModal';
import { TrackingStatusModal } from '../components/tracking/TrackingStatusModal';

import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { 
  UserCheck, Search, MapPin, Star, Plus, Eye, Clock, 
  Award, CheckCircle2, Edit, Trash2 
} from 'lucide-react';
import { toast } from 'sonner';

const categories: (VendorCategory | 'All')[] = [
  'All',
  'Catering',
  'Photography',
  'Decoration',
  'Music & DJ',
  'Makeup & Styling',
  'Event Planning',
  'Security & Logistics'
];

export const VendorsPage = () => {
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');

  // Modals
  const [activePortfolioVendor, setActivePortfolioVendor] = useState<VendorItem | null>(null);
  const [activeEditVendor, setActiveEditVendor] = useState<VendorItem | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeTrackingTarget, setActiveTrackingTarget] = useState<{
    id: string;
    type: 'Venue' | 'Vendor';
    name: string;
    suggestedAmount: number;
  } | null>(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = () => {
    setVendors(vendorVenueService.getVendors());
  };

  const cities = useMemo(() => {
    const list = Array.from(new Set(vendors.map(v => v.city)));
    return ['All', ...list];
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = 
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || vendor.category === selectedCategory;
      const matchesCity = selectedCity === 'All' || vendor.city === selectedCity;

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [vendors, searchQuery, selectedCategory, selectedCity]);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      vendorVenueService.deleteVendor(id);
      loadVendors();
      toast.success(`${name} removed`);
    }
  };

  const getStatusBadge = (status: VendorStatus) => {
    switch (status) {
      case 'Verified':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Verified Partner</Badge>;
      case 'Active':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Active</Badge>;
      case 'Pending Contract':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">Pending Contract</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">On Hold</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="h-7 w-7 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Vendors Directory</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Connect with top-rated caterers, photographers, decorators, DJs, and event artists.
            </p>
          </div>

          <Button 
            onClick={() => { setActiveEditVendor(null); setIsFormModalOpen(true); }}
            className="gap-2 bg-primary text-primary-foreground font-semibold shadow-md"
          >
            <Plus className="h-4 w-4" /> Add Vendor Partner
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search vendor by name, service..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div>
                <Select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}>
                  {cities.map(city => (
                    <option key={city} value={city}>{city === 'All' ? 'All Cities' : city}</option>
                  ))}
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Grid */}
        {filteredVendors.length === 0 ? (
          <Card className="p-12 text-center border-dashed border-2">
            <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No vendors found</h3>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting search parameters or category selection.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map(vendor => (
              <Card key={vendor.id} className="group border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between">
                <CardContent className="p-5 space-y-4">
                  {/* Top Profile Header */}
                  <div className="flex items-start gap-4">
                    <img 
                      src={vendor.profilePhoto} 
                      alt={vendor.name} 
                      className="h-16 w-16 rounded-xl object-cover border-2 border-primary/20 shrink-0 shadow-sm"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-primary truncate flex items-center gap-1">
                          <Award className="h-3 w-3" /> {vendor.category}
                        </span>
                        {getStatusBadge(vendor.status)}
                      </div>
                      <h3 className="font-bold text-base text-foreground mt-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {vendor.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" /> {vendor.city}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-bold text-amber-500"><Star className="h-3 w-3 fill-amber-500" /> {vendor.rating}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {vendor.bio}
                  </p>

                  {/* Portfolio Thumbnails Preview */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground font-semibold">
                      <span>Portfolio Preview</span>
                      <button 
                        onClick={() => setActivePortfolioVendor(vendor)}
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" /> View All ({vendor.portfolioImages.length})
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {vendor.portfolioImages.slice(0, 3).map((img, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setActivePortfolioVendor(vendor)}
                          className="h-16 rounded-md overflow-hidden bg-slate-900 cursor-pointer group/thumb relative"
                        >
                          <img src={img} alt={`work ${idx}`} className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Services Tags */}
                  <div className="flex flex-wrap gap-1">
                    {vendor.services.slice(0, 2).map((service, idx) => (
                      <span key={idx} className="inline-flex items-center text-[10px] font-medium bg-pink-50 text-pink-700 px-2 py-0.5 rounded border border-pink-100">
                        <CheckCircle2 className="h-3 w-3 text-pink-500 mr-1" />
                        {service}
                      </span>
                    ))}
                  </div>
                </CardContent>

                {/* Footer Actions */}
                <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground">Starting Rate</span>
                    <div className="text-sm font-bold text-foreground">
                      ₹{vendor.startingPrice.toLocaleString()} <span className="text-[10px] font-normal text-muted-foreground">onwards</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveTrackingTarget({
                          id: vendor.id,
                          type: 'Vendor',
                          name: vendor.name,
                          suggestedAmount: vendor.startingPrice
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
                      onClick={() => { setActiveEditVendor(vendor); setIsFormModalOpen(true); }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                    </Button>

                    <Button 
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(vendor.id, vendor.name)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Portfolio Modal */}
        {activePortfolioVendor && (
          <VendorPortfolioModal 
            vendor={activePortfolioVendor} 
            onClose={() => setActivePortfolioVendor(null)}
            onTrackBooking={(v) => {
              setActiveTrackingTarget({
                id: v.id,
                type: 'Vendor',
                name: v.name,
                suggestedAmount: v.startingPrice
              });
            }}
          />
        )}

        {/* Form Modal */}
        {isFormModalOpen && (
          <VendorVenueFormModal 
            type="Vendor"
            initialData={activeEditVendor || undefined}
            onClose={() => { setIsFormModalOpen(false); setActiveEditVendor(null); }}
            onSaveVendor={() => { loadVendors(); }}
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
