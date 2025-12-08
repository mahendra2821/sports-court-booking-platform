import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCourts, useEquipment, useCoaches, usePricingRules } from '@/hooks/useBookingData';
import { formatCurrency } from '@/lib/pricing-engine';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MapPin, Package, Users, DollarSign, Loader2 } from 'lucide-react';

const AdminPanel = () => {
  const queryClient = useQueryClient();
  const { data: courts = [], isLoading: courtsLoading } = useCourts();
  const { data: equipment = [], isLoading: equipmentLoading } = useEquipment();
  const { data: coaches = [], isLoading: coachesLoading } = useCoaches();
  const { data: pricingRules = [], isLoading: rulesLoading } = usePricingRules();

  const togglePricingRule = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('pricing_rules')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing_rules'] });
      toast.success('Pricing rule updated');
    },
    onError: () => {
      toast.error('Failed to update pricing rule');
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage courts, equipment, coaches, and pricing rules
          </p>
        </div>

        <Tabs defaultValue="courts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="courts" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Courts</span>
            </TabsTrigger>
            <TabsTrigger value="equipment" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger value="coaches" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Coaches</span>
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
          </TabsList>

          {/* Courts Tab */}
          <TabsContent value="courts">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Courts Management</CardTitle>
                <CardDescription>Manage your badminton courts</CardDescription>
              </CardHeader>
              <CardContent>
                {courtsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courts.map((court) => (
                      <div
                        key={court.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-secondary">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">{court.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={court.court_type === 'indoor' ? 'indoor' : 'outdoor'}>
                                {court.court_type}
                              </Badge>
                              <Badge variant={court.is_active ? 'success' : 'destructive'}>
                                {court.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs hidden md:block">
                          {court.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Equipment Tab */}
          <TabsContent value="equipment">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Equipment Inventory</CardTitle>
                <CardDescription>Manage rental equipment</CardDescription>
              </CardHeader>
              <CardContent>
                {equipmentLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {equipment.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-secondary">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-medium">{item.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary">{item.equipment_type}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {item.available_quantity}/{item.total_quantity} available
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-accent">
                            {formatCurrency(Number(item.rental_price))}
                          </span>
                          <p className="text-xs text-muted-foreground">per session</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coaches Tab */}
          <TabsContent value="coaches">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Coaches</CardTitle>
                <CardDescription>Manage coach profiles and availability</CardDescription>
              </CardHeader>
              <CardContent>
                {coachesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {coaches.map((coach) => (
                      <div
                        key={coach.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {coach.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-medium">{coach.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {coach.specialization && (
                                <Badge variant="secondary">{coach.specialization}</Badge>
                              )}
                              <Badge variant={coach.is_active ? 'success' : 'destructive'}>
                                {coach.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-accent">
                            {formatCurrency(Number(coach.hourly_rate))}
                          </span>
                          <p className="text-xs text-muted-foreground">per hour</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Pricing Rules</CardTitle>
                <CardDescription>
                  Configure dynamic pricing rules. Rules are applied in order of priority (highest first) and can stack.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rulesLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-accent" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pricingRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-secondary">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{rule.name}</h3>
                              <Badge variant="outline">Priority: {rule.priority}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {rule.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{rule.rule_type}</Badge>
                              {Number(rule.multiplier) !== 1 && (
                                <Badge variant={Number(rule.multiplier) > 1 ? 'warning' : 'success'}>
                                  {Number(rule.multiplier) > 1 ? '+' : ''}{((Number(rule.multiplier) - 1) * 100).toFixed(0)}%
                                </Badge>
                              )}
                              {Number(rule.flat_fee) !== 0 && (
                                <Badge variant="accent">
                                  {Number(rule.flat_fee) > 0 ? '+' : ''}{formatCurrency(Number(rule.flat_fee))}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={(checked) =>
                              togglePricingRule.mutate({ id: rule.id, is_active: checked })
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
