import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Users, Star, CheckCircle2, Maximize2, Sparkles, Phone } from 'lucide-react';
import type { VenueItem } from '../../data/vendorVenueTypes';
import { Button } from '../ui/Button';

interface VenueLightboxModalProps {
  venue: VenueItem;
  onClose: () => void;
  onTrackBooking?: (venue: VenueItem) => void;
}

const photoCategoryLabels = [
  'Grand Entrance Façade & Driveway',
  'Interior Main Ballroom Setup',
  'Seating Layout & Mandap Decor',
  'Evening Ambiance & Architectural Lighting',
  'Lush Outdoor Garden & Pool Lawn'
];

export const VenueLightboxModal: React.FC<VenueLightboxModalProps> = ({ venue, onClose, onTrackBooking }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const images = venue.images && venue.images.length > 0 ? venue.images : [venue.coverImage];

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, isFullscreen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diffX = touchStartX - e.changedTouches[0].clientX;
    if (diffX > 50) {
      handleNext();
    } else if (diffX < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  const currentCategory = photoCategoryLabels[activeIndex % photoCategoryLabels.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 w-full ${
          isFullscreen ? 'max-w-[98vw] h-[98vh]' : 'max-w-4xl max-h-[90vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{venue.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                <Sparkles className="h-3 w-3" /> Real Gallery
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {venue.city}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-primary" /> Up to {venue.capacity.toLocaleString()} guests</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-bold text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-500" /> {venue.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Gallery'}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Photo Display Area */}
        <div 
          className={`relative w-full bg-slate-950 flex items-center justify-center select-none overflow-hidden ${
            isFullscreen ? 'flex-1' : 'h-[440px]'
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={images[activeIndex]} 
            alt={`${venue.name} photo ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80';
            }}
          />

          {/* Category Tag Overlay */}
          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-white/20">
            <Sparkles className="h-3.5 w-3.5 text-pink-400" /> {currentCategory}
          </div>

          {/* Photo Counter Badge */}
          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
            Photo {activeIndex + 1} of {images.length}
          </div>

          {/* Prev/Next Buttons */}
          {images.length > 1 && (
            <>
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-slate-900 shadow-xl hover:bg-white transition-all transform hover:scale-105"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 text-slate-900 shadow-xl hover:bg-white transition-all transform hover:scale-105"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Selector Row */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 bg-muted/40 overflow-x-auto border-b border-border">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 transition-all ${
                  idx === activeIndex ? 'ring-2 ring-primary opacity-100 scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Details & Amenities Section */}
        <div className="p-6 bg-card space-y-4 overflow-y-auto max-h-[220px]">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {venue.description}
          </p>

          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Venue Amenities & Facilities
            </h4>
            <div className="flex flex-wrap gap-2">
              {venue.amenities.map((amenity, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Daily Rental Rate</span>
              <div className="text-xl font-extrabold text-primary">
                ₹{venue.pricePerDay.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/ day</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href={`tel:${venue.contactPhone}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-xs font-semibold text-foreground hover:bg-muted/80">
                <Phone className="h-3.5 w-3.5" /> {venue.contactPhone}
              </a>
              {onTrackBooking && (
                <Button 
                  onClick={() => { onTrackBooking(venue); onClose(); }} 
                  className="bg-primary text-primary-foreground font-semibold px-4 py-2 text-sm shadow-md"
                >
                  Track Booking Proposal
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
