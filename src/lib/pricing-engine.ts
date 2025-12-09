import { PricingRule, Court, Coach, SelectedEquipment, PriceBreakdown } from '@/types/booking';

interface PricingContext {
  court: Court;
  baseHourlyRate: number;
  date: Date;
  startTime: string;
  endTime: string;
  equipment: SelectedEquipment[];
  coach: Coach | null;
  rules: PricingRule[];
}

function getHourFromTime(time: string): number {
  const [hours] = time.split(':').map(Number);
  return hours;
}

function getDayOfWeek(date: Date): number {
  return date.getDay();
}

function calculateDurationHours(startTime: string, endTime: string): number {
  const startHour = getHourFromTime(startTime);
  const endHour = getHourFromTime(endTime);
  return endHour - startHour;
}

function doesRuleApply(rule: PricingRule, context: PricingContext): boolean {
  const { conditions } = rule;
  const startHour = getHourFromTime(context.startTime);
  const dayOfWeek = getDayOfWeek(context.date);

  switch (rule.rule_type) {
    case 'time_based':
      if (conditions.start_hour !== undefined && conditions.end_hour !== undefined) {
        return startHour >= conditions.start_hour && startHour < conditions.end_hour;
      }
      return false;

    case 'day_based':
      if (Array.isArray(conditions.days)) {
        return conditions.days.includes(dayOfWeek);
      }
      return false;

    case 'court_type':
      if (conditions.court_type) {
        return context.court.court_type === conditions.court_type;
      }
      return false;

    case 'custom':
      // Custom rules can have multiple conditions
      return true;

    default:
      return false;
  }
}

export function calculatePrice(context: PricingContext): PriceBreakdown {
  const duration = calculateDurationHours(context.startTime, context.endTime);
  const basePrice = context.baseHourlyRate * duration;

  // Get applicable rules sorted by priority (higher priority first)
  const applicableRules = context.rules
    .filter(rule => rule.is_active && doesRuleApply(rule, context))
    .sort((a, b) => b.priority - a.priority);

  // Calculate court adjustments
  let adjustedPrice = basePrice;
  const courtAdjustments: { name: string; amount: number }[] = [];

  for (const rule of applicableRules) {
    const previousPrice = adjustedPrice;

    // Apply multiplier
    if (rule.multiplier !== 1) {
      adjustedPrice = adjustedPrice * rule.multiplier;
    }

    // Apply flat fee
    if (rule.flat_fee !== 0) {
      adjustedPrice += rule.flat_fee;
    }

    const adjustment = adjustedPrice - previousPrice;
    if (adjustment !== 0) {
      courtAdjustments.push({
        name: rule.name,
        amount: adjustment,
      });
    }
  }

  // Calculate equipment total
  const equipmentTotal = context.equipment.reduce((sum, item) => {
    return sum + (item.equipment.rental_price * item.quantity);
  }, 0);

  // Calculate coach total
  const coachTotal = context.coach ? context.coach.hourly_rate * duration : 0;

  // Calculate final total
  const totalPrice = adjustedPrice + equipmentTotal + coachTotal;

  return {
    basePrice,
    courtAdjustments,
    equipmentTotal,
    coachTotal,
    totalPrice,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
