'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import { Flame, User, LogIn, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Header() {
  const { user, profile, isSupabaseConnected, loginWithGoogle } = useApp();

  return (
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

        {/* User / Sync Status */}
        <div className="flex items-center gap-2">
          {isSupabaseConnected ? (
            user ? (
              <div className="flex items-center gap-2 bg-slate-900/80 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs text-slate-300 font-medium truncate max-w-[100px]">
                  {profile.full_name.split(' ')[0]}
                </span>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 bg-amber-400 text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-300 transition-colors shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Google</span>
              </button>
            )
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span className="text-[11px] text-slate-300 font-medium">Mode Local</span>
            </div>
          )}

          <Link
            href="/nutrition"
            className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:border-amber-400/50 transition-all"
            title="Mon Profil & Métabolisme"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
