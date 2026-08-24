'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { Dumbbell, Flame, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WeeklySummaryCard() {
  const { workouts } = useApp();

  // Compute days of current week (Lun-Dim)
  const now = new Date();
  const currentDay = now.getDay(); // 0 is Sunday
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const weekDaysStatus = daysOfWeek.map((label, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const dateStr = dayDate.toISOString().split('T')[0];

    // Check if any workout was completed on this date
    const hasWorkout = workouts.some((w) => {
      if (!w.completed_at) return false;
      const workoutDate = new Date(w.completed_at).toISOString().split('T')[0];
      return workoutDate === dateStr;
    });

    const isToday = now.toISOString().split('T')[0] === dateStr;

    return {
      label,
      dateStr,
      hasWorkout,
      isToday,
    };
  });

  // Calculate total volume this week
  const workoutsThisWeek = workouts.filter((w) => {
    if (!w.completed_at) return false;
    return new Date(w.completed_at) >= monday;
  });

  const totalWeeklyVolume = workoutsThisWeek.reduce((sum, w) => sum + (w.total_volume_kg || 0), 0);
  const sessionsCount = workoutsThisWeek.length;
  const targetSessions = 5;

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Semaine d'Entraînement</h4>
            <p className="text-[11px] text-slate-400">Objectif 5 séances &bull; Surcharge active</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-black text-amber-400">
            {sessionsCount}
            <span className="text-xs text-slate-400 font-normal"> / {targetSessions}</span>
          </span>
        </div>
      </div>

      {/* Week days row */}
      <div className="grid grid-cols-7 gap-1.5 my-3">
        {weekDaysStatus.map((day, idx) => (
          <div
            key={idx}
            className={cn(
              'flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all text-center',
              day.hasWorkout
                ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 shadow-sm shadow-amber-500/20'
                : day.isToday
                ? 'bg-slate-800 border-cyan-400/80 text-cyan-300'
                : 'bg-slate-900/60 border-slate-800/80 text-slate-400'
            )}
          >
            <span className="text-[10px] font-bold uppercase">{day.label}</span>
            <div className="mt-1">
              {day.hasWorkout ? (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Stats Bar */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80">
        <div className="bg-slate-900/70 rounded-2xl p-3 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
            <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
            <span>Volume total</span>
          </div>
          <div className="text-lg font-black text-slate-100 font-mono">
            {totalWeeklyVolume.toLocaleString('fr-FR')} <span className="text-xs font-semibold text-slate-400">kg</span>
          </div>
        </div>

        <div className="bg-slate-900/70 rounded-2xl p-3 border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Régularité</span>
          </div>
          <div className="text-lg font-black text-emerald-400 font-mono">
            {Math.round((sessionsCount / targetSessions) * 100)} %
          </div>
        </div>
      </div>
    </div>
  );
}
