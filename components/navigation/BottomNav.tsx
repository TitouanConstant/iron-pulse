'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { 
  LayoutDashboard, 
  Dumbbell, 
  Flame, 
  UtensilsCrossed, 
  PlayCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomNav() {
  const pathname = usePathname();
  const { activeWorkout } = useApp();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      label: 'Séances',
      href: '/workouts',
      icon: Dumbbell,
      active: pathname.startsWith('/workouts') && !pathname.includes('/active'),
    },
    {
      label: 'En Cours',
      href: '/workouts/active',
      icon: PlayCircle,
      active: pathname.includes('/active'),
      isHighlight: Boolean(activeWorkout),
      badge: activeWorkout ? `${activeWorkout.sets.filter(s => s.is_completed).length}/${activeWorkout.sets.length}` : undefined,
    },
    {
      label: 'Hyrox 2027',
      href: '/hyrox',
      icon: Flame,
      active: pathname.startsWith('/hyrox'),
    },
    {
      label: 'Nutrition',
      href: '/nutrition',
      icon: UtensilsCrossed,
      active: pathname.startsWith('/nutrition'),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-slate-800/80 px-2 py-2 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all select-none min-w-[62px]',
                item.active
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              {item.isHighlight ? (
                <div className="relative">
                  <div className="w-10 h-10 -mt-4 mb-0.5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center shadow-lg shadow-amber-500/40 animate-pulse-glow">
                    <Icon className="w-5 h-5 fill-black" />
                  </div>
                  {item.badge && (
                    <span className="absolute -top-4 -right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-slate-900">
                      {item.badge}
                    </span>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Icon className={cn('w-5 h-5 mb-1', item.active && 'scale-110')} />
                </div>
              )}
              
              <span className={cn('text-[10px] tracking-tight', item.active ? 'text-amber-400 font-bold' : 'text-slate-400')}>
                {item.label}
              </span>

              {item.active && !item.isHighlight && (
                <span className="absolute bottom-0 w-4 h-0.5 bg-amber-400 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
