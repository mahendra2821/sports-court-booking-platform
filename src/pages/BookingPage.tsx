import { Header } from '@/components/layout/Header';
import { BookingWizard } from '@/components/booking/BookingWizard';

const BookingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Court</h1>
          <p className="text-muted-foreground">
            Select your court, time, and any additional services
          </p>
        </div>
        
        <BookingWizard />
      </main>
    </div>
  );
};

export default BookingPage;
