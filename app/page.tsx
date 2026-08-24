'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import HyroxCountdownCard from '@/components/dashboard/HyroxCountdownCard';
import QuickActions from '@/components/dashboard/QuickActions';
import WeeklySummaryCard from '@/components/dashboard/WeeklySummaryCard';
import NutritionSummaryCard from '@/components/dashboard/NutritionSummaryCard';
import { formatDateFr } from '@/lib/utils';
import { 
  Dumbbell, 
  Flame, 
  ArrowRight, 
  Trophy, 
  Clock, 
  Calendar, 
  CheckCircle2 
} from 'lucide-react';
import { formatSecondsToTime } from '@/lib/calculations/hyrox';

export default function DashboardPage() {
  const { profile, workouts, hyroxLogs } = useApp();

  const completedWorkouts = workouts.filter((w) => w.completed_at);
  const lastWorkout = completedWorkouts[0];
  const lastHyroxLog = hyroxLogs[0];

  return (
    <div className="space-y-4 pb-6 animate-slide-up">
      {/* Athlete Welcome Bar */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            Prêt pour l'entraînement
          </span>
          <h1 className="text-xl font-black text-white tracking-tight">
            Bonjour, {profile.full_name.split(' ')[0]} 👋
          </h1>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-slate-400">
            {new Intl.DateTimeFormat('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date())}
          </div>
        </div>
      </div>

      {/* Hyrox April 2027 Countdown */}
      <HyroxCountdownCard />

      {/* Primary & Quick Action CTAs */}
      <QuickActions />

      {/* Weekly Training View & Volume */}
      <WeeklySummaryCard />

      {/* Nutrition, BMR & Daily Calorie Budget */}
      <NutritionSummaryCard />

      {/* Recent Activity Log Cards */}
      <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h4 className="text-sm font-bold text-white">Dernières Activités</h4>
          </div>
          <Link
            href="/workouts"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Historique</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Last Workout */}
        {lastWorkout ? (
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white line-clamp-1">{lastWorkout.name}</div>
                <div className="text-[10px] text-slate-400">
                  {formatDateFr(lastWorkout.completed_at || lastWorkout.started_at)} &bull; {lastWorkout.total_volume_kg.toLocaleString('fr-FR')} kg levés
                </div>
              </div>
            </div>

            <span className="text-[10px] px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg font-bold border border-emerald-500/30">
              Validée
            </span>
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic text-center py-2">
            Aucune séance enregistrée pour le moment.
          </div>
        )}

        {/* Last Hyrox Station Log */}
        {lastHyroxLog && (
          <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {lastHyroxLog.station_type.replace(/_/g, ' ')}
                </div>
                <div className="text-[10px] text-slate-400">
                  {formatDateFr(lastHyroxLog.logged_date)} &bull; Chrono : {formatSecondsToTime(lastHyroxLog.time_seconds)}
                </div>
              </div>
            </div>

            {lastHyroxLog.is_personal_record && (
              <span className="text-[10px] px-2 py-1 bg-amber-400/20 text-amber-300 rounded-lg font-bold border border-amber-400/40 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                <span>PR</span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
