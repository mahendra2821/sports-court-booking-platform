import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAllBookings, useCourts, useCoaches } from '@/hooks/useBookingData';
import { formatCurrency } from '@/lib/pricing-engine';
import { format, parseISO } from 'date-fns';
import { Calendar, Clock, MapPin, User, Package, Loader2 } from 'lucide-react';

const BookingHistory = () => {
  const { data: bookings = [], isLoading } = useAllBookings();
  const { data: courts = [] } = useCourts();
  const { data: coaches = [] } = useCoaches();

  const getCourtName = (courtId: string) => {
    const court = courts.find(c => c.id === courtId);
    return court?.name || 'Unknown Court';
  };

  const getCoachName = (coachId: string | null) => {
    if (!coachId) return null;
    const coach = coaches.find(c => c.id === coachId);
    return coach?.name || 'Unknown Coach';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Booking History</h1>
          <p className="text-muted-foreground">
            View and manage your past and upcoming bookings
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : bookings.length === 0 ? (
          <Card variant="elevated" className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Bookings Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't made any bookings yet. Book your first court now!
              </p>
              <Button variant="accent" asChild>
                <a href="/book">Book a Court</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const coachName = getCoachName(booking.coach_id);
              
              return (
                <Card
                  key={booking.id}
                  variant="elevated"
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">
                            {getCourtName(booking.court_id)}
                          </h3>
                          {getStatusBadge(booking.status)}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(parseISO(booking.booking_date), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </span>
                          {coachName && (
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {coachName}
                            </span>
                          )}
                        </div>

                        {booking.customer_name && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Booked by: </span>
                            <span>{booking.customer_name}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">
                          {formatCurrency(Number(booking.total_price))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Booked {format(parseISO(booking.created_at), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookingHistory;
