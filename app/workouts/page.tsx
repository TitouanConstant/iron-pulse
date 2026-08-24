'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { formatDateFr } from '@/lib/utils';
import StartWorkoutModal from '@/components/dashboard/StartWorkoutModal';
import ExerciseProgressionChart from '@/components/workouts/ExerciseProgressionChart';
import { 
  Plus, 
  Dumbbell, 
  TrendingUp, 
  Clock, 
  Trash2, 
  Star, 
  ChevronRight, 
  Play, 
  Flame, 
  BookOpen 
} from 'lucide-react';
import { formatSecondsToTime } from '@/lib/calculations/hyrox';

export default function WorkoutsPage() {
  const router = useRouter();
  const { workouts, deleteWorkout, activeWorkout } = useApp();
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);

  const completedWorkouts = workouts.filter((w) => w.completed_at);

  return (
    <div className="space-y-4 pb-12 animate-slide-up">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Musculation & Surcharge
          </span>
          <h1 className="text-xl font-black text-white">Journal d'Entraînement</h1>
        </div>

        <button
          onClick={() => setIsStartModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-amber-400 text-black font-black text-xs flex items-center gap-1.5 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nouvelle Séance</span>
        </button>
      </div>

      {/* If active workout banner */}
      {activeWorkout && (
        <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/10 border-2 border-amber-400 rounded-3xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-black animate-pulse">
              <Play className="w-5 h-5 fill-black" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-amber-400">En cours</span>
              <h4 className="text-sm font-bold text-white line-clamp-1">{activeWorkout.name}</h4>
              <p className="text-xs text-slate-400">
                {activeWorkout.sets.filter((s) => s.is_completed).length} séries validées
              </p>
            </div>
          </div>
          <Link
            href="/workouts/active"
            className="px-4 py-2 bg-amber-400 text-black font-black text-xs rounded-xl shadow-md"
          >
            Reprendre
          </Link>
        </div>
      )}

      {/* Navigation shortcuts */}
      <div className="grid grid-cols-2 gap-2.5">
        <Link
          href="/workouts/exercises"
          className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-amber-400/40 transition-all flex items-center gap-2.5 text-left"
        >
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Bibliothèque</div>
            <div className="text-[10px] text-slate-400">50+ Exercices</div>
          </div>
        </Link>

        <Link
          href="/workouts/exercises#charts"
          className="p-3.5 rounded-2xl glass-card border border-slate-800 hover:border-cyan-400/40 transition-all flex items-center gap-2.5 text-left"
        >
          <div className="p-2 rounded-xl bg-cyan-400/10 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Progression 1RM</div>
            <div className="text-[10px] text-slate-400">Courbes de charge</div>
          </div>
        </Link>
      </div>

      {/* Progressive Overload Chart Preview */}
      <ExerciseProgressionChart />

      {/* Past Workouts History */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Historique des Séances ({completedWorkouts.length})
          </h2>
        </div>

        {completedWorkouts.length === 0 ? (
          <div className="glass-card rounded-3xl p-8 text-center border border-slate-800 text-slate-400">
            <Dumbbell className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Aucune séance terminée pour le moment.</p>
          </div>
        ) : (
          completedWorkouts.map((w) => {
            const completedSets = w.sets.filter((s) => s.is_completed);
            return (
              <div
                key={w.id}
                className="glass-card rounded-3xl p-4 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{w.name}</h3>
                      {w.rating && (
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-[11px] font-bold font-mono ml-0.5">{w.rating}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {formatDateFr(w.completed_at || w.started_at)}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Voulez-vous supprimer cette séance de l\'historique ?')) {
                        deleteWorkout(w.id);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-900/70 rounded-xl p-2 border border-slate-800/80">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Séries</span>
                    <div className="text-sm font-black text-white font-mono">{completedSets.length}</div>
                  </div>
                  <div className="bg-slate-900/70 rounded-xl p-2 border border-slate-800/80">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Tonnage</span>
                    <div className="text-sm font-black text-amber-400 font-mono">
                      {w.total_volume_kg ? w.total_volume_kg.toLocaleString('fr-FR') : '0'} kg
                    </div>
                  </div>
                  <div className="bg-slate-900/70 rounded-xl p-2 border border-slate-800/80">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Durée</span>
                    <div className="text-sm font-black text-cyan-400 font-mono">
                      {formatSecondsToTime(w.duration_seconds || 3600)}
                    </div>
                  </div>
                </div>

                {/* Sets preview list */}
                <div className="text-xs text-slate-400 space-y-1 pt-1 border-t border-slate-800/60">
                  {w.sets.slice(0, 3).map((s, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-300 truncate max-w-[200px]">
                        &bull; {s.exercise_name}
                      </span>
                      <span className="font-mono text-slate-400">
                        {s.weight_kg}kg &times; {s.reps} reps {s.rpe ? `@${s.rpe}` : ''}
                      </span>
                    </div>
                  ))}
                  {w.sets.length > 3 && (
                    <div className="text-[10px] text-amber-400/80 italic">
                      + {w.sets.length - 3} autres séries...
                    </div>
                  )}
                </div>

                {w.notes && (
                  <div className="text-xs text-slate-300 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                    &ldquo;{w.notes}&rdquo;
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <StartWorkoutModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
      />
    </div>
  );
}
