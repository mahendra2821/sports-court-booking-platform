import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, History, Settings, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/book', label: 'Book Now', icon: Calendar },
    { href: '/history', label: 'My Bookings', icon: History },
    { href: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-hero flex items-center justify-center">
            <span className="text-lg">🏸</span>
          </div>
          <span className="font-bold text-xl">CourtBook</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    "gap-2",
                    isActive && "bg-accent/10 text-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="md:hidden">
          <Link to="/book">
            <Button variant="accent" size="sm">
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
