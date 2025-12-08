import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/Header';
import { useCourts, useCoaches } from '@/hooks/useBookingData';
import { Calendar, Users, Clock, Shield, ChevronRight, Star, MapPin } from 'lucide-react';

const Index = () => {
  const { data: courts = [] } = useCourts();
  const { data: coaches = [] } = useCoaches();

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Book your preferred court in just a few clicks with real-time availability.',
    },
    {
      icon: Users,
      title: 'Expert Coaches',
      description: 'Train with certified coaches to improve your game and technique.',
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Open 6 AM - 10 PM daily. Find a slot that works for your schedule.',
    },
    {
      icon: Shield,
      title: 'Equipment Rental',
      description: 'Professional rackets and shoes available for rent.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJIMjR2LTJoMTJ6bTAtNHYySDI0di0yaDEyem0wLTR2Mkg0di0yaDMyem0wLTR2Mkg0di0yaDMyem0wLTR2Mkg0di0yaDMyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="container relative py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="accent" className="mb-6 animate-bounce-subtle">
              Now Open • Book Your Court Today
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up">
              Book Your Perfect
              <span className="block text-accent">Badminton Court</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Premium indoor and outdoor courts, professional equipment, and expert coaching — 
              all in one place. Start playing today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/book">
                <Button variant="accent" size="xl" className="w-full sm:w-auto">
                  Book a Court
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Admin Panel
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CourtBook?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for the perfect badminton experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="elevated"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courts Preview */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Our Courts</h2>
              <p className="text-muted-foreground">Premium facilities for your game</p>
            </div>
            <Link to="/book">
              <Button variant="outline">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courts.map((court, index) => (
              <Card
                key={court.id}
                variant={court.court_type === 'indoor' ? 'indoor' : 'outdoor'}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{court.name}</h3>
                      <Badge variant={court.court_type === 'indoor' ? 'indoor' : 'outdoor'} className="mt-1">
                        {court.court_type}
                      </Badge>
                    </div>
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{court.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Preview */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Meet Our Coaches</h2>
              <p className="text-muted-foreground">Expert guidance for every skill level</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coaches.map((coach, index) => (
              <Card
                key={coach.id}
                variant="elevated"
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center text-2xl text-primary-foreground font-bold">
                    {coach.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold mb-1">{coach.name}</h3>
                  {coach.specialization && (
                    <Badge variant="secondary" className="mb-3">{coach.specialization}</Badge>
                  )}
                  <div className="flex justify-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{coach.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card variant="elevated" className="overflow-hidden">
            <div className="gradient-hero p-12 text-center">
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                Ready to Play?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Book your court now and experience the best badminton facilities in town. 
                First-time players get 20% off!
              </p>
              <Link to="/book">
                <Button variant="accent" size="xl">
                  Book Your Court Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 CourtBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
