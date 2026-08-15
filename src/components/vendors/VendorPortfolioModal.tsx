import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star, MapPin, Award, CheckCircle2, Phone } from 'lucide-react';
import type { VendorItem } from '../../data/vendorVenueTypes';
import { Button } from '../ui/Button';

interface VendorPortfolioModalProps {
  vendor: VendorItem;
  onClose: () => void;
  onTrackBooking?: (vendor: VendorItem) => void;
}

export const VendorPortfolioModal: React.FC<VendorPortfolioModalProps> = ({ vendor, onClose, onTrackBooking }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const images = vendor.portfolioImages && vendor.portfolioImages.length > 0
    ? vendor.portfolioImages
    : [vendor.profilePhoto];

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
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col w-full max-w-3xl max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <img 
              src={vendor.profilePhoto} 
              alt={vendor.name} 
              className="h-12 w-12 rounded-full object-cover border-2 border-primary shadow-sm"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">{vendor.name}</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-100 text-pink-700">
                  <Award className="h-3 w-3" /> {vendor.category}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {vendor.city}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-bold text-amber-500"><Star className="h-3.5 w-3.5 fill-amber-500" /> {vendor.rating} Ratings</span>
                <span>•</span>
                <span className="text-emerald-600 font-medium">Verified EventsVedika Partner</span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main Photo Viewer */}
        <div 
          className="relative w-full h-[400px] bg-slate-950 flex items-center justify-center select-none overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img 
            src={images[activeIndex]} 
            alt={`${vendor.name} portfolio ${activeIndex + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = vendor.profilePhoto;
            }}
          />

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

          <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
            Portfolio Work {activeIndex + 1} of {images.length}
          </div>

          <div className="absolute bottom-4 left-4 bg-pink-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-pink-400/30">
            <CheckCircle2 className="h-3.5 w-3.5" /> Verified Portfolio Showcase
          </div>
        </div>

        {/* Thumbnail Bar */}
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

        {/* Bio & Services */}
        <div className="p-6 bg-card space-y-4 overflow-y-auto max-h-[220px]">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {vendor.bio}
          </p>

          <div>
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Services Offered
            </h4>
            <div className="flex flex-wrap gap-2">
              {vendor.services.map((service, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-pink-50 text-pink-700 border border-pink-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-500" />
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground font-medium">Starting Package Estimate</span>
              <div className="text-xl font-extrabold text-primary">
                ₹{vendor.startingPrice.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">onwards</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href={`tel:${vendor.contactPhone}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted text-xs font-semibold text-foreground hover:bg-muted/80">
                <Phone className="h-3.5 w-3.5" /> {vendor.contactPhone}
              </a>
              {onTrackBooking && (
                <Button 
                  onClick={() => { onTrackBooking(vendor); onClose(); }} 
                  className="bg-primary text-primary-foreground font-semibold px-4 py-2 text-sm shadow-md"
                >
                  Initiate Booking Track
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
