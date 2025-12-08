export interface Court {
  id: string;
  name: string;
  court_type: 'indoor' | 'outdoor';
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourtBasePrice {
  id: string;
  court_id: string;
  base_hourly_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  equipment_type: 'racket' | 'shoes';
  total_quantity: number;
  available_quantity: number;
  rental_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  hourly_rate: number;
  specialization: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CoachAvailability {
  id: string;
  coach_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  created_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  description: string | null;
  rule_type: 'time_based' | 'day_based' | 'court_type' | 'custom';
  conditions: Record<string, any>;
  multiplier: number;
  flat_fee: number;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string | null;
  court_id: string;
  coach_id: string | null;
  booking_date: string;
  start_time: string;
  end_time: string;
  base_price: number;
  equipment_price: number;
  coach_price: number;
  adjustments_price: number;
  total_price: number;
  price_breakdown: Record<string, any>;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingEquipment {
  id: string;
  booking_id: string;
  equipment_id: string;
  quantity: number;
  price_at_booking: number;
  created_at: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  courtId?: string;
}

export interface SelectedEquipment {
  equipment: Equipment;
  quantity: number;
}

export interface PriceBreakdown {
  basePrice: number;
  courtAdjustments: { name: string; amount: number }[];
  equipmentTotal: number;
  coachTotal: number;
  totalPrice: number;
}

export interface BookingFormData {
  court: Court | null;
  date: Date | null;
  timeSlot: { start: string; end: string } | null;
  equipment: SelectedEquipment[];
  coach: Coach | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes: string;
}
