'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShieldAlert, History } from 'lucide-react';

export const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Auction', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/teams', label: 'Teams', icon: <ShieldAlert className="w-5 h-5" /> },
    { href: '/players', label: 'Players', icon: <Users className="w-5 h-5" /> },
    { href: '/admin', label: 'Admin', icon: <History className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-black font-black">A</span>
          </div>
          <span className="text-xl font-black uppercase tracking-tighter">SPL <span className="text-amber-500">Auction 2026</span></span>
        </div>

        <div className="flex gap-1 md:gap-4">
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${pathname === link.href
                ? 'bg-amber-500 text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {link.icon}
              <span className="hidden sm:inline">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};
