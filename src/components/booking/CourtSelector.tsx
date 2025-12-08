import { Court, CourtBasePrice } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/pricing-engine';
import { MapPin, Home, Sun, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CourtSelectorProps {
  courts: Court[];
  basePrices: CourtBasePrice[];
  selectedCourt: Court | null;
  onSelect: (court: Court) => void;
}

export function CourtSelector({ courts, basePrices, selectedCourt, onSelect }: CourtSelectorProps) {
  const getBasePrice = (courtId: string) => {
    const price = basePrices.find(p => p.court_id === courtId);
    return price?.base_hourly_rate ?? 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold">Select a Court</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courts.map((court, index) => {
          const isSelected = selectedCourt?.id === court.id;
          const basePrice = getBasePrice(court.id);
          const isIndoor = court.court_type === 'indoor';
          
          return (
            <Card
              key={court.id}
              variant={isSelected ? 'selected' : isIndoor ? 'indoor' : 'outdoor'}
              className={cn(
                "cursor-pointer animate-fade-in",
                isSelected && "ring-accent"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onSelect(court)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isIndoor ? "bg-indoor/10" : "bg-outdoor/10"
                    )}>
                      {isIndoor ? (
                        <Home className={cn("h-5 w-5", isIndoor ? "text-indoor" : "text-outdoor")} />
                      ) : (
                        <Sun className={cn("h-5 w-5", isIndoor ? "text-indoor" : "text-outdoor")} />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{court.name}</CardTitle>
                      <Badge variant={isIndoor ? 'indoor' : 'outdoor'} className="mt-1">
                        {court.court_type}
                      </Badge>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="p-1 bg-accent rounded-full">
                      <Check className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {court.description || 'Standard badminton court'}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {formatCurrency(basePrice)}
                  </span>
                  <span className="text-sm text-muted-foreground">/hour</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
