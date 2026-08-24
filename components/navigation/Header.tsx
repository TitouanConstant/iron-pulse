'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import { Flame, User, LogIn, CheckCircle2, ShieldCheck, ChevronDown } from 'lucide-react';
import UserAccountModal from './UserAccountModal';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user, profile, isSupabaseConnected, loginWithGoogle } = useApp();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-black fill-black" />
            </div>
            <div>
              <span className="text-base font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-amber-400 bg-clip-text text-transparent">
                IRON<span className="text-amber-400">PULSE</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-0.5">
                <span className="text-[10px] font-bold text-amber-400/90 tracking-widest uppercase">
                  HYROX &bull; 2027
                </span>
              </div>
            </div>
          </Link>

          {/* Unified Profile & Connection Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAccountModalOpen(true)}
              className={cn(
                'flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-full border transition-all active:scale-95 text-xs',
                user
                  ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-400 text-slate-200 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-900/90 border-slate-700/80 hover:border-amber-400/50 text-slate-300'
              )}
            >
              {/* Status Indicator Dot */}
              <span
                className={cn(
                  'w-2 h-2 rounded-full shrink-0',
                  user ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'
                )}
              />

              {/* Avatar Initial */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-black text-[10px] flex items-center justify-center shrink-0">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>

              {/* User Name */}
              <span className="font-bold text-xs max-w-[85px] truncate">
                {user ? profile.full_name.split(' ')[0] : 'Compte'}
              </span>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 opacity-70" />
            </button>
          </div>
        </div>
      </header>

      <UserAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  );
}
