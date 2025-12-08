import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

interface DateTimeSelectorProps {
  selectedDate: Date | null;
  selectedTimeSlot: { start: string; end: string } | null;
  availableSlots: TimeSlot[];
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (slot: { start: string; end: string }) => void;
}

export function DateTimeSelector({
  selectedDate,
  selectedTimeSlot,
  availableSlots,
  onDateSelect,
  onTimeSelect,
}: DateTimeSelectorProps) {
  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  const formatTime = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    return hour < 12 ? `${hour}AM` : hour === 12 ? '12PM' : `${hour - 12}PM`;
  };

  const isPeakHour = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    return hour >= 18 && hour < 21;
  };

  const isEarlyBird = (time: string) => {
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    return hour >= 6 && hour < 9;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Select Date</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={onDateSelect}
            disabled={(date) => isBefore(date, today) || isBefore(maxDate, date)}
            className="rounded-lg border-0"
          />
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Select Time</CardTitle>
          </div>
          {selectedDate && (
            <p className="text-sm text-muted-foreground">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </p>
          )}
        </CardHeader>
        <CardContent>
          {!selectedDate ? (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              Please select a date first
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                <Badge variant="success" className="text-xs">Available</Badge>
                <Badge variant="secondary" className="text-xs">Booked</Badge>
                <Badge variant="warning" className="text-xs">Peak Hours</Badge>
                <Badge variant="accent" className="text-xs">Early Bird</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((slot, index) => {
                  const isSelected = selectedTimeSlot?.start === slot.start;
                  const isPeak = isPeakHour(slot.start);
                  const isEarly = isEarlyBird(slot.start);
                  
                  return (
                    <button
                      key={slot.start}
                      disabled={!slot.available}
                      onClick={() => slot.available && onTimeSelect(slot)}
                      className={cn(
                        "p-2 rounded-lg text-sm font-medium transition-all duration-200 animate-fade-in",
                        slot.available
                          ? isSelected
                            ? "bg-accent text-accent-foreground shadow-glow"
                            : isPeak
                            ? "bg-warning/10 text-warning border border-warning/30 hover:bg-warning/20"
                            : isEarly
                            ? "bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
                            : "bg-secondary hover:bg-secondary/80 border border-transparent"
                          : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      )}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      {formatTime(slot.start)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
