'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import StartWorkoutModal from './StartWorkoutModal';
import { 
  Play, 
  Flame, 
  Scale, 
  Plus, 
  RotateCcw, 
  ArrowRight 
} from 'lucide-react';
import HyroxLogModal from '../hyrox/HyroxLogModal';
import WeightLogModal from '../nutrition/WeightLogModal';

export default function QuickActions() {
  const router = useRouter();
  const { activeWorkout } = useApp();
  const [isStartWorkoutOpen, setIsStartWorkoutOpen] = useState(false);
  const [isHyroxModalOpen, setIsHyroxModalOpen] = useState(false);
  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);

  return (
    <>
      <div className="grid gap-3">
        {/* If workout in progress, show big Resume Banner */}
        {activeWorkout ? (
          <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border-2 border-amber-400 rounded-3xl p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black animate-pulse">
                <Play className="w-5 h-5 fill-black" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-black text-amber-400">
                  Séance en cours
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{activeWorkout.name}</h4>
                <p className="text-xs text-slate-400">
                  {activeWorkout.sets.filter((s) => s.is_completed).length} / {activeWorkout.sets.length} séries validées
                </p>
              </div>
            </div>

            <Link
              href="/workouts/active"
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <span>Reprendre</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Main Large CTA: Start Workout */
          <button
            onClick={() => setIsStartWorkoutOpen(true)}
            className="w-full py-4 px-5 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-black font-black text-base shadow-xl shadow-amber-500/25 flex items-center justify-between hover:brightness-105 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-black/15 flex items-center justify-center">
                <Play className="w-5 h-5 fill-black" />
              </div>
              <div className="text-left">
                <div className="leading-tight">Démarrer une Séance</div>
                <div className="text-[11px] font-semibold text-black/70">
                  Saisie direct &bull; Timer &bull; Surcharge
                </div>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-black" />
            </div>
          </button>
        )}

        {/* Secondary Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setIsHyroxModalOpen(true)}
            className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-amber-500/40 transition-all text-left flex items-center gap-3 active:scale-98"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">Log Hyrox</div>
              <div className="text-[10px] text-slate-400">8 Stations & Run</div>
            </div>
          </button>

          <button
            onClick={() => setIsWeightModalOpen(true)}
            className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/40 transition-all text-left flex items-center gap-3 active:scale-98"
          >
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">Pesée du Jour</div>
              <div className="text-[10px] text-slate-400">Suivi & Métabolisme</div>
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      <StartWorkoutModal
        isOpen={isStartWorkoutOpen}
        onClose={() => setIsStartWorkoutOpen(false)}
      />

      <HyroxLogModal
        isOpen={isHyroxModalOpen}
        onClose={() => setIsHyroxModalOpen(false)}
      />

      <WeightLogModal
        isOpen={isWeightModalOpen}
        onClose={() => setIsWeightModalOpen(false)}
      />
    </>
  );
}
