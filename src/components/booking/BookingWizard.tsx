import { useState, useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CourtSelector } from './CourtSelector';
import { DateTimeSelector } from './DateTimeSelector';
import { EquipmentSelector } from './EquipmentSelector';
import { CoachSelector } from './CoachSelector';
import { PriceBreakdownComponent } from './PriceBreakdown';
import { calculatePrice } from '@/lib/pricing-engine';
import {
  useCourts,
  useCourtBasePrices,
  useEquipment,
  useCoaches,
  useCoachAvailability,
  usePricingRules,
  useBookings,
  getAvailableTimeSlots,
} from '@/hooks/useBookingData';
import { BookingFormData, SelectedEquipment, Court, Coach, PriceBreakdown } from '@/types/booking';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Court', description: 'Select a court' },
  { id: 2, name: 'Date & Time', description: 'Pick your slot' },
  { id: 3, name: 'Equipment', description: 'Add rentals' },
  { id: 4, name: 'Coach', description: 'Optional coaching' },
  { id: 5, name: 'Confirm', description: 'Review & book' },
];

export function BookingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>({
    court: null,
    date: null,
    timeSlot: null,
    equipment: [],
    coach: null,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    notes: '',
  });

  const queryClient = useQueryClient();

  const { data: courts = [] } = useCourts();
  const { data: basePrices = [] } = useCourtBasePrices();
  const { data: equipment = [] } = useEquipment();
  const { data: coaches = [] } = useCoaches();
  const { data: coachAvailability = [] } = useCoachAvailability();
  const { data: pricingRules = [] } = usePricingRules();
  
  const dateString = formData.date ? format(formData.date, 'yyyy-MM-dd') : undefined;
  const { data: bookings = [] } = useBookings(dateString);

  const availableSlots = useMemo(() => {
    if (!formData.court || !formData.date) return [];
    return getAvailableTimeSlots(formData.court.id, format(formData.date, 'yyyy-MM-dd'), bookings);
  }, [formData.court, formData.date, bookings]);

  const priceBreakdown = useMemo((): PriceBreakdown | null => {
    if (!formData.court || !formData.date || !formData.timeSlot) return null;

    const basePrice = basePrices.find(p => p.court_id === formData.court!.id);
    if (!basePrice) return null;

    return calculatePrice({
      court: formData.court,
      baseHourlyRate: Number(basePrice.base_hourly_rate),
      date: formData.date,
      startTime: formData.timeSlot.start,
      endTime: formData.timeSlot.end,
      equipment: formData.equipment,
      coach: formData.coach,
      rules: pricingRules.map(r => ({
        ...r,
        multiplier: Number(r.multiplier),
        flat_fee: Number(r.flat_fee),
        conditions: r.conditions as Record<string, any>,
      })),
    });
  }, [formData, basePrices, pricingRules]);

  const duration = useMemo(() => {
    if (!formData.timeSlot) return 1;
    const [startHour] = formData.timeSlot.start.split(':').map(Number);
    const [endHour] = formData.timeSlot.end.split(':').map(Number);
    return endHour - startHour;
  }, [formData.timeSlot]);

  const createBookingMutation = useMutation({
    mutationFn: async () => {
      if (!formData.court || !formData.date || !formData.timeSlot || !priceBreakdown) {
        throw new Error('Missing required booking data');
      }

      // Create the main booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          court_id: formData.court.id,
          coach_id: formData.coach?.id || null,
          booking_date: format(formData.date, 'yyyy-MM-dd'),
          start_time: formData.timeSlot.start,
          end_time: formData.timeSlot.end,
          base_price: priceBreakdown.basePrice,
          equipment_price: priceBreakdown.equipmentTotal,
          coach_price: priceBreakdown.coachTotal,
          adjustments_price: priceBreakdown.courtAdjustments.reduce((sum, adj) => sum + adj.amount, 0),
          total_price: priceBreakdown.totalPrice,
          price_breakdown: priceBreakdown,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone,
          notes: formData.notes,
          status: 'confirmed',
        })
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Add equipment to booking
      if (formData.equipment.length > 0) {
        const equipmentInserts = formData.equipment.map(item => ({
          booking_id: booking.id,
          equipment_id: item.equipment.id,
          quantity: item.quantity,
          price_at_booking: item.equipment.rental_price,
        }));

        const { error: equipmentError } = await supabase
          .from('booking_equipment')
          .insert(equipmentInserts);

        if (equipmentError) throw equipmentError;
      }

      return booking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast.success('Booking confirmed!', {
        description: 'Your court has been successfully booked.',
      });
      // Reset form
      setFormData({
        court: null,
        date: null,
        timeSlot: null,
        equipment: [],
        coach: null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        notes: '',
      });
      setCurrentStep(1);
    },
    onError: (error) => {
      toast.error('Booking failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    },
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.court !== null;
      case 2:
        return formData.date !== null && formData.timeSlot !== null;
      case 3:
        return true; // Equipment is optional
      case 4:
        return true; // Coach is optional
      case 5:
        return formData.customerName && formData.customerEmail;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (canProceed()) {
      createBookingMutation.mutate();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Progress Steps */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center justify-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={cn(
                stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
                'relative'
              )}
            >
              {step.id < currentStep ? (
                <div className="flex items-center">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <Check className="h-5 w-5 text-accent-foreground" />
                  </span>
                  <span className="ml-4 hidden sm:block text-sm font-medium text-foreground">
                    {step.name}
                  </span>
                </div>
              ) : step.id === currentStep ? (
                <div className="flex items-center">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-background">
                    <span className="text-accent font-semibold">{step.id}</span>
                  </span>
                  <span className="ml-4 hidden sm:block text-sm font-medium text-accent">
                    {step.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted bg-background">
                    <span className="text-muted-foreground">{step.id}</span>
                  </span>
                  <span className="ml-4 hidden sm:block text-sm font-medium text-muted-foreground">
                    {step.name}
                  </span>
                </div>
              )}
              {stepIdx !== steps.length - 1 && (
                <div
                  className={cn(
                    'absolute top-5 left-10 -ml-px w-full h-0.5',
                    step.id < currentStep ? 'bg-accent' : 'bg-muted'
                  )}
                />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="animate-fade-in">
            {currentStep === 1 && (
              <CourtSelector
                courts={courts}
                basePrices={basePrices}
                selectedCourt={formData.court}
                onSelect={(court) => setFormData({ ...formData, court })}
              />
            )}

            {currentStep === 2 && (
              <DateTimeSelector
                selectedDate={formData.date}
                selectedTimeSlot={formData.timeSlot}
                availableSlots={availableSlots}
                onDateSelect={(date) => setFormData({ ...formData, date: date || null, timeSlot: null })}
                onTimeSelect={(slot) => setFormData({ ...formData, timeSlot: slot })}
              />
            )}

            {currentStep === 3 && (
              <EquipmentSelector
                equipment={equipment}
                selectedEquipment={formData.equipment}
                onEquipmentChange={(equipment) => setFormData({ ...formData, equipment })}
              />
            )}

            {currentStep === 4 && (
              <CoachSelector
                coaches={coaches}
                availability={coachAvailability}
                selectedCoach={formData.coach}
                selectedDate={formData.date}
                selectedTimeSlot={formData.timeSlot}
                onSelect={(coach) => setFormData({ ...formData, coach })}
              />
            )}

            {currentStep === 5 && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Any special requests?"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < 5 ? (
              <Button
                variant="accent"
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleSubmit}
                disabled={!canProceed() || createBookingMutation.isPending}
              >
                {createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Price Sidebar */}
        <div className="lg:col-span-1">
          <PriceBreakdownComponent breakdown={priceBreakdown} duration={duration} />
        </div>
      </div>
    </div>
  );
}
