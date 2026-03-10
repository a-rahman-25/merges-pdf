import { Link, useLocation } from 'react-router-dom';
import { Combine } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/ai-document-tools', label: 'AI Tools' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/blog', label: 'Blog' },
];

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Combine className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">MergesPDF</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-4">
          {navLinks.map((link) => {
            const isActive = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`hidden text-sm sm:block px-2 py-1 rounded-md transition-colors ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
