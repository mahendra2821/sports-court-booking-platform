import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Court, CourtBasePrice, Equipment, Coach, CoachAvailability, PricingRule, Booking } from '@/types/booking';

export function useCourts() {
  return useQuery({
    queryKey: ['courts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Court[];
    },
  });
}

export function useCourtBasePrices() {
  return useQuery({
    queryKey: ['court_base_prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('court_base_prices')
        .select('*');
      
      if (error) throw error;
      return data as CourtBasePrice[];
    },
  });
}

export function useEquipment() {
  return useQuery({
    queryKey: ['equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('is_active', true)
        .order('equipment_type', { ascending: true });
      
      if (error) throw error;
      return data as Equipment[];
    },
  });
}

export function useCoaches() {
  return useQuery({
    queryKey: ['coaches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coaches')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Coach[];
    },
  });
}

export function useCoachAvailability() {
  return useQuery({
    queryKey: ['coach_availability'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coach_availability')
        .select('*');
      
      if (error) throw error;
      return data as CoachAvailability[];
    },
  });
}

export function usePricingRules() {
  return useQuery({
    queryKey: ['pricing_rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pricing_rules')
        .select('*')
        .order('priority', { ascending: false });
      
      if (error) throw error;
      return data as PricingRule[];
    },
  });
}

export function useBookings(date?: string) {
  return useQuery({
    queryKey: ['bookings', date],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select('*')
        .neq('status', 'cancelled')
        .order('booking_date', { ascending: true });
      
      if (date) {
        query = query.eq('booking_date', date);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Booking[];
    },
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: ['all_bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as Booking[];
    },
  });
}

export function isCoachAvailable(
  coach: Coach,
  availability: CoachAvailability[],
  date: Date,
  startTime: string,
  endTime: string
): boolean {
  const dayOfWeek = date.getDay();
  
  const coachAvailability = availability.filter(
    a => a.coach_id === coach.id && a.day_of_week === dayOfWeek
  );

  if (coachAvailability.length === 0) return false;

  return coachAvailability.some(slot => {
    return startTime >= slot.start_time && endTime <= slot.end_time;
  });
}

export function getAvailableTimeSlots(
  courtId: string,
  date: string,
  bookings: Booking[]
): { start: string; end: string; available: boolean }[] {
  const slots = [];
  const courtBookings = bookings.filter(
    b => b.court_id === courtId && b.booking_date === date
  );

  // Generate slots from 6 AM to 10 PM
  for (let hour = 6; hour < 22; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00:00`;

    const isBooked = courtBookings.some(
      b => b.start_time <= startTime && b.end_time > startTime
    );

    slots.push({
      start: startTime,
      end: endTime,
      available: !isBooked,
    });
  }

  return slots;
}
