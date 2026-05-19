import Link from 'next/link';
import { Settings, MessageSquare, Home } from 'lucide-react';
import classNames from 'classnames';

interface NavbarProps {
  currentPage?: 'home' | 'assistant' | 'history' | 'settings';
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
  return (
    <nav className="bg-dark-900/80 backdrop-blur-lg border-b border-dark-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <span className="font-bold text-white hidden sm:block group-hover:text-brand-400 transition-colors">
              Jarvis AI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink href="/" label="Home" icon={<Home className="w-4 h-4" />} active={currentPage === 'home'} />
            <NavLink href="/assistant" label="Assistant" icon={<MessageSquare className="w-4 h-4" />} active={currentPage === 'assistant'} />
            <NavLink href="/history" label="History" icon={<MessageSquare className="w-4 h-4" />} active={currentPage === 'history'} />
            <NavLink href="/settings" label="Settings" icon={<Settings className="w-4 h-4" />} active={currentPage === 'settings'} />
          </div>

          {/* Mobile Menu Placeholder */}
          <div className="md:hidden">
            <button className="p-2 rounded-lg hover:bg-dark-700 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, icon, active }) => {
  return (
    <Link
      href={href}
      className={classNames(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        active
          ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30'
          : 'text-dark-300 hover:text-white hover:bg-dark-700'
      )}
    >
      {icon}
      <span className="hidden lg:block">{label}</span>
    </Link>
  );
};
