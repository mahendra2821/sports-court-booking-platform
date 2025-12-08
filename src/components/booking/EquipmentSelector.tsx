import { Equipment, SelectedEquipment } from '@/types/booking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/pricing-engine';
import { Package, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: SelectedEquipment[];
  onEquipmentChange: (equipment: SelectedEquipment[]) => void;
}

export function EquipmentSelector({
  equipment,
  selectedEquipment,
  onEquipmentChange,
}: EquipmentSelectorProps) {
  const getSelectedQuantity = (equipmentId: string) => {
    const selected = selectedEquipment.find(e => e.equipment.id === equipmentId);
    return selected?.quantity ?? 0;
  };

  const updateQuantity = (item: Equipment, delta: number) => {
    const currentQuantity = getSelectedQuantity(item.id);
    const newQuantity = Math.max(0, Math.min(item.available_quantity, currentQuantity + delta));

    if (newQuantity === 0) {
      onEquipmentChange(selectedEquipment.filter(e => e.equipment.id !== item.id));
    } else {
      const existing = selectedEquipment.find(e => e.equipment.id === item.id);
      if (existing) {
        onEquipmentChange(
          selectedEquipment.map(e =>
            e.equipment.id === item.id ? { ...e, quantity: newQuantity } : e
          )
        );
      } else {
        onEquipmentChange([...selectedEquipment, { equipment: item, quantity: newQuantity }]);
      }
    }
  };

  const groupedEquipment = equipment.reduce((acc, item) => {
    const type = item.equipment_type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, Equipment[]>);

  const typeLabels: Record<string, string> = {
    racket: 'Rackets',
    shoes: 'Court Shoes',
  };

  const typeIcons: Record<string, string> = {
    racket: '🏸',
    shoes: '👟',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Package className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold">Add Equipment (Optional)</h2>
      </div>

      {Object.entries(groupedEquipment).map(([type, items]) => (
        <Card key={type} variant="elevated" className="overflow-hidden">
          <CardHeader className="bg-secondary/50 py-3">
            <CardTitle className="text-base flex items-center gap-2">
              <span>{typeIcons[type]}</span>
              {typeLabels[type] || type}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {items.map((item, index) => {
                const selectedQty = getSelectedQuantity(item.id);
                const isSelected = selectedQty > 0;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg transition-all duration-200 animate-fade-in",
                      isSelected
                        ? "bg-accent/10 border border-accent/30"
                        : "bg-background border border-transparent hover:border-border"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.available_quantity} available
                        </Badge>
                      </div>
                      <span className="text-sm text-accent font-semibold">
                        {formatCurrency(item.rental_price)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item, -1)}
                        disabled={selectedQty === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{selectedQty}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item, 1)}
                        disabled={selectedQty >= item.available_quantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
