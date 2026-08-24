'use client';

import React from 'react';
import { RivalAthlete, UserProfile } from '@/lib/types';
import { Trophy, Flame, Dumbbell, Award, Timer, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatSecondsToTime } from '@/lib/calculations/hyrox';

interface Props {
  athlete: RivalAthlete | (UserProfile & { stats?: any });
  isUser?: boolean;
  onRemove?: () => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function AthleteCard({
  athlete,
  isUser = false,
  onRemove,
  isSelected = false,
  onSelect,
}: Props) {
  const isRival = !isUser && 'athlete_code' in athlete;
  const rivalData = isRival ? (athlete as RivalAthlete) : null;

  return (
    <div
      onClick={onSelect}
      className={cn(
        'glass-card rounded-3xl p-4 border transition-all cursor-pointer relative overflow-hidden',
        isSelected
          ? 'border-amber-400/80 bg-slate-900/90 shadow-xl shadow-amber-400/10 scale-[1.02]'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div
              className={cn(
                'w-12 h-12 rounded-2xl font-black text-lg flex items-center justify-center shadow-lg',
                isUser
                  ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-black shadow-amber-500/20'
                  : 'bg-gradient-to-tr from-cyan-600 via-cyan-500 to-blue-400 text-white shadow-cyan-500/20'
              )}
            >
              {athlete.full_name.charAt(0).toUpperCase()}
            </div>
            {isUser && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-tighter">
                Vous
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">{athlete.full_name}</h4>
              <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                {athlete.athlete_code || 'PULSE-ME'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {(isRival ? rivalData?.division : (athlete as UserProfile).hyrox_division)?.replace('_', ' ').toUpperCase() || 'OPEN MEN'} &bull;{' '}
              {isRival ? rivalData?.weight_kg : (athlete as UserProfile).current_weight_kg || 80} kg
            </p>
          </div>
        </div>

        {/* Action / Delete */}
        <div className="flex items-center gap-2">
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Supprimer ${athlete.full_name} de vos rivaux ?`)) {
                  onRemove();
                }
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Supprimer ce rival"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Stat Highlights */}
      {rivalData && (
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80">
          <div className="bg-black/30 rounded-xl p-2 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Timer className="w-3 h-3 text-amber-400" />
              <span>Est. Hyrox</span>
            </span>
            <span className="text-xs font-black text-white">
              {formatSecondsToTime(rivalData.stats.estimated_hyrox_time_seconds)}
            </span>
          </div>

          <div className="bg-black/30 rounded-xl p-2 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Dumbbell className="w-3 h-3 text-cyan-400" />
              <span>1RM Couché</span>
            </span>
            <span className="text-xs font-black text-white">
              {rivalData.stats.strength_1rm.bench_press_kg} kg
            </span>
          </div>

          <div className="bg-black/30 rounded-xl p-2 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-emerald-400" />
              <span>Tonnage Sem.</span>
            </span>
            <span className="text-xs font-black text-white">
              {Math.round(rivalData.stats.weekly_tonnage_kg / 1000)}k kg
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
