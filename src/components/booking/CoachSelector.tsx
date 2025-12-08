import { Coach, CoachAvailability } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/pricing-engine';
import { isCoachAvailable } from '@/hooks/useBookingData';
import { Users, Check, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CoachSelectorProps {
  coaches: Coach[];
  availability: CoachAvailability[];
  selectedCoach: Coach | null;
  selectedDate: Date | null;
  selectedTimeSlot: { start: string; end: string } | null;
  onSelect: (coach: Coach | null) => void;
}

export function CoachSelector({
  coaches,
  availability,
  selectedCoach,
  selectedDate,
  selectedTimeSlot,
  onSelect,
}: CoachSelectorProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const canSelectCoach = selectedDate && selectedTimeSlot;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold">Add a Coach (Optional)</h2>
      </div>

      {!canSelectCoach && (
        <Card variant="elevated" className="p-6 text-center">
          <p className="text-muted-foreground">
            Please select a date and time to see coach availability
          </p>
        </Card>
      )}

      {canSelectCoach && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* No Coach Option */}
          <Card
            variant={selectedCoach === null ? 'selected' : 'interactive'}
            className="cursor-pointer"
            onClick={() => onSelect(null)}
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎾</span>
              </div>
              <h3 className="font-semibold mb-1">No Coach</h3>
              <p className="text-sm text-muted-foreground">Play on your own</p>
              {selectedCoach === null && (
                <Badge variant="accent" className="mt-3">Selected</Badge>
              )}
            </CardContent>
          </Card>

          {coaches.map((coach, index) => {
            const isAvailable = isCoachAvailable(
              coach,
              availability,
              selectedDate,
              selectedTimeSlot.start,
              selectedTimeSlot.end
            );
            const isSelected = selectedCoach?.id === coach.id;

            return (
              <Card
                key={coach.id}
                variant={isSelected ? 'selected' : isAvailable ? 'interactive' : 'default'}
                className={cn(
                  "cursor-pointer animate-fade-in",
                  !isAvailable && "opacity-60 cursor-not-allowed"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => isAvailable && onSelect(coach)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4 ring-2 ring-background shadow-lg">
                      <AvatarImage src={coach.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {getInitials(coach.name)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold mb-1">{coach.name}</h3>
                    {coach.specialization && (
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {coach.specialization}
                      </Badge>
                    )}
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {coach.bio}
                    </p>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="h-3 w-3 fill-warning text-warning" />
                      ))}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold text-accent">
                        {formatCurrency(coach.hourly_rate)}
                      </span>
                      <span className="text-xs text-muted-foreground">/hour</span>
                    </div>
                    {!isAvailable && (
                      <Badge variant="destructive" className="mt-3">Unavailable</Badge>
                    )}
                    {isSelected && (
                      <div className="mt-3 flex items-center gap-1 text-accent">
                        <Check className="h-4 w-4" />
                        <span className="text-sm font-medium">Selected</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
