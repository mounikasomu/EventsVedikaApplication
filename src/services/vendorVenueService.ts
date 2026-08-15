import type { VenueItem, VendorItem, TrackingLog, TrackingStage } from '../data/vendorVenueTypes';

const VENUES_KEY = 'event_crm_venues_v1';
const VENDORS_KEY = 'event_crm_vendors_v1';
const TRACKING_KEY = 'event_crm_tracking_v1';

const initialVenues: VenueItem[] = [
  {
    id: 'vn-101',
    name: 'The Royal Grand Palace & Gardens',
    city: 'Bengaluru',
    capacity: 1200,
    pricePerDay: 350000,
    rating: 4.9,
    description: 'Opulent Heritage banquet hall with sprawling lush green gardens, crystal chandeliers, state-of-the-art acoustic sound systems, and dedicated bride & groom suites.',
    amenities: ['Centralized AC', 'Valet Parking for 400 Cars', 'Bridal Dressing Suite', 'In-house Decorators', 'Power Backup', 'Swimming Pool Lawn'],
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    contactPhone: '+91 98765 43210',
    contactEmail: 'events@royalgrandpalace.com',
    address: '12 Palace Grounds, Bellary Road, Sadashivnagar, Bengaluru'
  },
  {
    id: 'vn-102',
    name: 'Azure Bayfront Resort & Convention',
    city: 'Goa',
    capacity: 800,
    pricePerDay: 450000,
    rating: 4.8,
    description: 'Breathtaking beachfront resort offering sunset view open lawns, beachside mandap setups, and luxury guest accommodation for destination weddings.',
    amenities: ['Private Beach Access', 'Oceanfront Lawns', 'Infinity Pool Bar', 'Sea View Suites', 'Airport Shuttle', 'Full Bar License'],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Booked',
    contactPhone: '+91 98123 45678',
    contactEmail: 'bookings@azurebayresort.com',
    address: 'Miramar Beach Road, Panaji, Goa'
  },
  {
    id: 'vn-103',
    name: 'Crown Horizon Convention Center',
    city: 'Hyderabad',
    capacity: 2500,
    pricePerDay: 500000,
    rating: 4.7,
    description: 'High-capacity futuristic convention hall tailored for corporate summits, tech expos, grand receptions, and international galas.',
    amenities: ['Pillarless Grand Ballroom', '4K LED Video Walls', 'High-Speed Wi-Fi 6', 'VIP Helipad Access', 'Underground Parking', 'Multi-Cuisine Kitchens'],
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Available',
    contactPhone: '+91 91234 56789',
    contactEmail: 'info@crownhorizon.com',
    address: 'HITEC City Main Road, Madhapur, Hyderabad'
  },
  {
    id: 'vn-104',
    name: 'Serene Oasis Heritage Haveli',
    city: 'Udaipur',
    capacity: 500,
    pricePerDay: 600000,
    rating: 4.9,
    description: 'Exquisite 18th-century lakefront haveli with intricate Rajasthani architecture, courtyard fountains, and royal dining pavilions.',
    amenities: ['Lake View Courtyard', 'Royal Suite Upgrades', 'Folk Dancer Stage', 'Speedboat Airport Transfers', 'Heritage Lighting'],
    coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Under Review',
    contactPhone: '+91 97890 12345',
    contactEmail: 'reservations@sereneoasis.com',
    address: 'Lake Pichola Road, Old City, Udaipur, Rajasthan'
  }
];

const initialVendors: VendorItem[] = [
  {
    id: 'vd-201',
    name: 'Epicurean Feast Gourmet Caterers',
    category: 'Catering',
    city: 'Bengaluru',
    rating: 4.9,
    startingPrice: 1200,
    profilePhoto: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Verified',
    contactPhone: '+91 98450 11223',
    contactEmail: 'chef@epicureanfeast.com',
    bio: 'Award-winning catering company offering North Indian, South Indian, Pan-Asian, and Continental live counters with organic ingredients.',
    services: ['Live Chat & Tandoor Counters', 'Molecular Gastronomy Desserts', 'Custom Mocktail & Cocktail Bars', 'VIP Plated Service']
  },
  {
    id: 'vd-202',
    name: 'Luminary Frame Studios & Cinema',
    category: 'Photography',
    city: 'Mumbai',
    rating: 4.9,
    startingPrice: 150000,
    profilePhoto: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Active',
    contactPhone: '+91 98200 99887',
    contactEmail: 'contact@luminaryframes.com',
    bio: 'Candid wedding photography and cinematic 4K film experts capturing timeless emotions across India and overseas.',
    services: ['Candid Wedding Photography', '4K Drone Aerial Cinematography', 'Pre-Wedding Concept Shoot', 'Same-Day Edit Highlights Teaser']
  },
  {
    id: 'vd-203',
    name: 'Velvet & Vines Floral Crafters',
    category: 'Decoration',
    city: 'Hyderabad',
    rating: 4.8,
    startingPrice: 250000,
    profilePhoto: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Verified',
    contactPhone: '+91 99000 33445',
    contactEmail: 'design@velvetvines.com',
    bio: 'Luxury floral artisans specializing in fairytale mandap setups, royal entrance tunnels, and theme lighting architecture.',
    services: ['Exotic Import Floral Mandaps', 'Custom Fairytale Stage Backdrop', 'Ambient Intelligent Lighting Systems', 'Seating & Table Styling']
  },
  {
    id: 'vd-204',
    name: 'Pulse Beats DJ & Concert Lighting',
    category: 'Music & DJ',
    city: 'Goa',
    rating: 4.7,
    startingPrice: 85000,
    profilePhoto: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    portfolioImages: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'
    ],
    status: 'Pending Contract',
    contactPhone: '+91 98888 77665',
    contactEmail: 'bookings@pulsebeatsdj.com',
    bio: 'Premium DJ collective and sound engineers bringing festival-grade Line Array audio, cold pyros, and LED dance floors.',
    services: ['Bollywood & EDM Celebrity DJ', 'JBL Line Array Sound System', 'Interactive LED Video Dance Floor', 'Cold Pyro & CO2 Cannons']
  }
];

const initialTrackingLogs: TrackingLog[] = [
  {
    id: 'tr-301',
    targetId: 'vn-101',
    targetType: 'Venue',
    targetName: 'The Royal Grand Palace & Gardens',
    customerName: 'Ananya Sharma & Rahul Verma',
    eventDate: '2026-11-18',
    stage: 'Confirmed',
    amount: 350000,
    notes: 'Advance booking confirmed for 2-day wedding reception. Hall layout finalized.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tr-302',
    targetId: 'vd-201',
    targetType: 'Vendor',
    targetName: 'Epicurean Feast Gourmet Caterers',
    customerName: 'TechCorp Annual Gala 2026',
    eventDate: '2026-10-05',
    stage: 'Deposit Paid',
    amount: 180000,
    notes: '50% deposit received. Menu tasting session scheduled for next week.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tr-303',
    targetId: 'vn-102',
    targetType: 'Venue',
    targetName: 'Azure Bayfront Resort & Convention',
    customerName: 'Rohan Mehta Destination Wedding',
    eventDate: '2026-12-10',
    stage: 'Contract Sent',
    amount: 450000,
    notes: 'Contract draft shared via email with client legal team for sign-off.',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tr-304',
    targetId: 'vd-202',
    targetType: 'Vendor',
    targetName: 'Luminary Frame Studios & Cinema',
    customerName: 'Priya & Vikram Sangeet',
    eventDate: '2026-09-24',
    stage: 'Inquiry',
    amount: 150000,
    notes: 'Client requested portfolio deck and custom drone coverage package pricing.',
    updatedAt: new Date().toISOString()
  }
];

export const vendorVenueService = {
  initializeStorage: () => {
    if (!localStorage.getItem(VENUES_KEY)) {
      localStorage.setItem(VENUES_KEY, JSON.stringify(initialVenues));
    }
    if (!localStorage.getItem(VENDORS_KEY)) {
      localStorage.setItem(VENDORS_KEY, JSON.stringify(initialVendors));
    }
    if (!localStorage.getItem(TRACKING_KEY)) {
      localStorage.setItem(TRACKING_KEY, JSON.stringify(initialTrackingLogs));
    }
  },

  // Venues API
  getVenues: (): VenueItem[] => {
    vendorVenueService.initializeStorage();
    const data = localStorage.getItem(VENUES_KEY);
    return data ? JSON.parse(data) : initialVenues;
  },

  getVenueById: (id: string): VenueItem | undefined => {
    return vendorVenueService.getVenues().find(v => v.id === id);
  },

  saveVenue: (venue: VenueItem): VenueItem => {
    const venues = vendorVenueService.getVenues();
    const index = venues.findIndex(v => v.id === venue.id);
    if (index >= 0) {
      venues[index] = venue;
    } else {
      venues.unshift(venue);
    }
    localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
    return venue;
  },

  deleteVenue: (id: string): void => {
    const venues = vendorVenueService.getVenues().filter(v => v.id !== id);
    localStorage.setItem(VENUES_KEY, JSON.stringify(venues));
  },

  // Vendors API
  getVendors: (): VendorItem[] => {
    vendorVenueService.initializeStorage();
    const data = localStorage.getItem(VENDORS_KEY);
    return data ? JSON.parse(data) : initialVendors;
  },

  getVendorById: (id: string): VendorItem | undefined => {
    return vendorVenueService.getVendors().find(v => v.id === id);
  },

  saveVendor: (vendor: VendorItem): VendorItem => {
    const vendors = vendorVenueService.getVendors();
    const index = vendors.findIndex(v => v.id === vendor.id);
    if (index >= 0) {
      vendors[index] = vendor;
    } else {
      vendors.unshift(vendor);
    }
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
    return vendor;
  },

  deleteVendor: (id: string): void => {
    const vendors = vendorVenueService.getVendors().filter(v => v.id !== id);
    localStorage.setItem(VENDORS_KEY, JSON.stringify(vendors));
  },

  // Tracking API
  getTrackingLogs: (): TrackingLog[] => {
    vendorVenueService.initializeStorage();
    const data = localStorage.getItem(TRACKING_KEY);
    return data ? JSON.parse(data) : initialTrackingLogs;
  },

  saveTrackingLog: (log: TrackingLog): TrackingLog => {
    const logs = vendorVenueService.getTrackingLogs();
    const index = logs.findIndex(l => l.id === log.id);
    if (index >= 0) {
      logs[index] = log;
    } else {
      logs.unshift(log);
    }
    localStorage.setItem(TRACKING_KEY, JSON.stringify(logs));
    return log;
  },

  updateTrackingStage: (id: string, stage: TrackingStage, notes?: string): TrackingLog | undefined => {
    const logs = vendorVenueService.getTrackingLogs();
    const index = logs.findIndex(l => l.id === id);
    if (index >= 0) {
      logs[index].stage = stage;
      if (notes !== undefined) {
        logs[index].notes = notes;
      }
      logs[index].updatedAt = new Date().toISOString();
      localStorage.setItem(TRACKING_KEY, JSON.stringify(logs));
      return logs[index];
    }
    return undefined;
  },

  deleteTrackingLog: (id: string): void => {
    const logs = vendorVenueService.getTrackingLogs().filter(l => l.id !== id);
    localStorage.setItem(TRACKING_KEY, JSON.stringify(logs));
  }
};
