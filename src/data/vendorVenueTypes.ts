export type VenueStatus = 'Available' | 'Booked' | 'Maintenance' | 'Under Review';

export interface VenueItem {
  id: string;
  name: string;
  city: string;
  capacity: number;
  pricePerDay: number;
  rating: number;
  description: string;
  amenities: string[];
  coverImage: string;
  images: string[];
  status: VenueStatus;
  contactPhone: string;
  contactEmail: string;
  address: string;
}

export type VendorCategory = 
  | 'Catering' 
  | 'Photography' 
  | 'Decoration' 
  | 'Music & DJ' 
  | 'Makeup & Styling' 
  | 'Event Planning' 
  | 'Security & Logistics';

export type VendorStatus = 'Verified' | 'Pending Contract' | 'Active' | 'On Hold';

export interface VendorItem {
  id: string;
  name: string;
  category: VendorCategory;
  city: string;
  rating: number;
  startingPrice: number;
  profilePhoto: string;
  portfolioImages: string[];
  status: VendorStatus;
  contactPhone: string;
  contactEmail: string;
  bio: string;
  services: string[];
}

export type TrackingStage = 
  | 'Inquiry' 
  | 'Contract Sent' 
  | 'Deposit Paid' 
  | 'Confirmed' 
  | 'Completed' 
  | 'Cancelled';

export interface TrackingLog {
  id: string;
  targetId: string;
  targetType: 'Venue' | 'Vendor';
  targetName: string;
  customerName: string;
  eventDate: string;
  stage: TrackingStage;
  amount: number;
  notes: string;
  updatedAt: string;
}
