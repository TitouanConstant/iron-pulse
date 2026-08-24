'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import { getHyroxCountdown, HYROX_DIVISIONS } from '@/lib/calculations/hyrox';
import { Flame, Trophy, ArrowRight, Clock } from 'lucide-react';

export default function HyroxCountdownCard() {
  const { profile } = useApp();
  const [countdown, setCountdown] = useState(getHyroxCountdown(profile.hyrox_target_date));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getHyroxCountdown(profile.hyrox_target_date));
    }, 1000);
    return () => clearInterval(timer);
  }, [profile.hyrox_target_date]);

  const division = HYROX_DIVISIONS[profile.hyrox_division] || { name: 'Men Open', tag: 'Open H' };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#131722] to-amber-950/40 border border-amber-500/30 p-5 shadow-xl shadow-amber-950/20">
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-400 text-black font-black text-xs flex items-center gap-1 shadow-md shadow-amber-400/20">
            <Flame className="w-3.5 h-3.5 fill-black" />
            <span>HYROX 2027</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700 text-[11px] font-semibold text-slate-300">
            {division.name}
          </span>
        </div>

        <Link
          href="/hyrox"
          className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 group"
        >
          <span>Prépa</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Title & Target Date */}
      <div className="mb-4">
        <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
          Objectif Championnat
        </h3>
        <p className="text-xs text-slate-400">
          Échéance mi-avril 2027 &bull; Préparation 8 Stations & 8 km Course
        </p>
      </div>

      {/* Countdown Digits */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl py-2.5 px-1 shadow-inner">
          <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
            {countdown.days}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Jours</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl py-2.5 px-1 shadow-inner">
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {countdown.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Heures</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl py-2.5 px-1 shadow-inner">
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            {countdown.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Min</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl py-2.5 px-1 shadow-inner">
          <div className="text-2xl font-black text-amber-400 font-mono tracking-tight animate-pulse">
            {countdown.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Sec</div>
        </div>
      </div>
    </div>
  );
}
