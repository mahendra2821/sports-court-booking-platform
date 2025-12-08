import { PriceBreakdown as PriceBreakdownType } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/pricing-engine';
import { Receipt, TrendingUp, TrendingDown, Package, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType | null;
  duration: number;
}

export function PriceBreakdownComponent({ breakdown, duration }: PriceBreakdownProps) {
  if (!breakdown) {
    return (
      <Card variant="elevated" className="sticky top-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-accent" />
            <CardTitle className="text-lg">Price Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Select a court and time slot to see pricing
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="sticky top-4 overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          <CardTitle className="text-lg">Price Summary</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">
            Court ({duration} hour{duration !== 1 ? 's' : ''})
          </span>
          <span className="font-medium">{formatCurrency(breakdown.basePrice)}</span>
        </div>

        {/* Adjustments */}
        {breakdown.courtAdjustments.length > 0 && (
          <div className="space-y-2">
            <Separator />
            <p className="text-sm font-medium text-muted-foreground">Adjustments</p>
            {breakdown.courtAdjustments.map((adj, index) => (
              <div
                key={index}
                className={cn(
                  "flex justify-between items-center text-sm animate-fade-in"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="flex items-center gap-2">
                  {adj.amount > 0 ? (
                    <TrendingUp className="h-3 w-3 text-warning" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-success" />
                  )}
                  {adj.name}
                </span>
                <span className={cn(
                  "font-medium",
                  adj.amount > 0 ? "text-warning" : "text-success"
                )}>
                  {adj.amount > 0 ? '+' : ''}{formatCurrency(adj.amount)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Equipment */}
        {breakdown.equipmentTotal > 0 && (
          <>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-4 w-4" />
                Equipment Rental
              </span>
              <span className="font-medium">{formatCurrency(breakdown.equipmentTotal)}</span>
            </div>
          </>
        )}

        {/* Coach */}
        {breakdown.coachTotal > 0 && (
          <>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                Coach Session
              </span>
              <span className="font-medium">{formatCurrency(breakdown.coachTotal)}</span>
            </div>
          </>
        )}

        {/* Total */}
        <Separator />
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold text-accent">
            {formatCurrency(breakdown.totalPrice)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
