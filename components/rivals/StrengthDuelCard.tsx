'use client';

import React from 'react';
import { RivalAthlete, UserProfile } from '@/lib/types';
import { Dumbbell, Crown, Flame, Scale, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  userProfile: UserProfile;
  rival: RivalAthlete;
  userStrength1RM: {
    bench_press_kg: number;
    back_squat_kg: number;
    deadlift_kg: number;
    overhead_press_kg: number;
    pull_ups_reps: number;
  };
  userWeeklyTonnage: number;
}

export default function StrengthDuelCard({
  userProfile,
  rival,
  userStrength1RM,
  userWeeklyTonnage,
}: Props) {
  const userWeight = userProfile.current_weight_kg || 82.5;
  const rivalWeight = rival.weight_kg || 80.0;

  const lifts = [
    {
      id: 'bench',
      name: 'Développé Couché (1RM)',
      userVal: userStrength1RM.bench_press_kg,
      rivalVal: rival.stats.strength_1rm.bench_press_kg,
      unit: 'kg',
      isRep: false,
    },
    {
      id: 'squat',
      name: 'Squat Arrière (1RM)',
      userVal: userStrength1RM.back_squat_kg,
      rivalVal: rival.stats.strength_1rm.back_squat_kg,
      unit: 'kg',
      isRep: false,
    },
    {
      id: 'deadlift',
      name: 'Soulevé de Terre (1RM)',
      userVal: userStrength1RM.deadlift_kg,
      rivalVal: rival.stats.strength_1rm.deadlift_kg,
      unit: 'kg',
      isRep: false,
    },
    {
      id: 'ohp',
      name: 'Développé Militaire (1RM)',
      userVal: userStrength1RM.overhead_press_kg,
      rivalVal: rival.stats.strength_1rm.overhead_press_kg,
      unit: 'kg',
      isRep: false,
    },
    {
      id: 'pullups',
      name: 'Tractions Strictes (Max Reps)',
      userVal: userStrength1RM.pull_ups_reps,
      rivalVal: rival.stats.strength_1rm.pull_ups_reps,
      unit: 'reps',
      isRep: true,
    },
  ];

  // Big 3 Total (Bench + Squat + Deadlift)
  const userTotal = userStrength1RM.bench_press_kg + userStrength1RM.back_squat_kg + userStrength1RM.deadlift_kg;
  const rivalTotal = rival.stats.strength_1rm.bench_press_kg + rival.stats.strength_1rm.back_squat_kg + rival.stats.strength_1rm.deadlift_kg;

  return (
    <div className="space-y-4">
      {/* Power & Tonnage Duel Summary */}
      <div className="glass-card rounded-3xl p-5 border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4 text-cyan-400" />
            <span>Total Big 3 & Volume d&apos;Entraînement</span>
          </span>
        </div>

        {/* Big 3 Total Comparison */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate">
              {userProfile.full_name.split(' ')[0]} (Vous)
            </span>
            <span className="text-xl font-black text-amber-300">
              {userTotal} <span className="text-xs font-normal text-slate-400">kg</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              Ratio : {(userTotal / userWeight).toFixed(2)}x PDC
            </span>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block truncate">
              {rival.full_name.split(' ')[0]}
            </span>
            <span className="text-xl font-black text-cyan-300">
              {rivalTotal} <span className="text-xs font-normal text-slate-400">kg</span>
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              Ratio : {(rivalTotal / rivalWeight).toFixed(2)}x PDC
            </span>
          </div>
        </div>

        {/* Weekly Tonnage Comparison */}
        <div className="p-3 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Volume Hebdo (7 jours)</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {Math.round(userWeeklyTonnage).toLocaleString()} kg vs {rival.stats.weekly_tonnage_kg.toLocaleString()} kg
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-amber-400 h-full transition-all"
              style={{
                width: `${(userWeeklyTonnage / (userWeeklyTonnage + rival.stats.weekly_tonnage_kg || 1)) * 100}%`,
              }}
              title="Votre volume"
            />
            <div
              className="bg-cyan-400 h-full transition-all"
              style={{
                width: `${(rival.stats.weekly_tonnage_kg / (userWeeklyTonnage + rival.stats.weekly_tonnage_kg || 1)) * 100}%`,
              }}
              title="Volume du rival"
            />
          </div>
        </div>
      </div>

      {/* Lifts Detail & Relative Ratios */}
      <div className="glass-card rounded-3xl p-4 border border-slate-800 bg-slate-900/80 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black text-white uppercase tracking-wider">
            1RM & Force Relative
          </h4>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Scale className="w-3 h-3 text-slate-400" />
            <span>Ratio poids de corps</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {lifts.map((lift) => {
            const isUserWinner = lift.userVal > lift.rivalVal;
            const isTie = lift.userVal === lift.rivalVal;

            const userRatio = !lift.isRep ? (lift.userVal / userWeight).toFixed(2) : null;
            const rivalRatio = !lift.isRep ? (lift.rivalVal / rivalWeight).toFixed(2) : null;

            return (
              <div
                key={lift.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{lift.name}</span>
                  <span
                    className={cn(
                      'text-[10px] font-black px-2 py-0.5 rounded-full border flex items-center gap-1',
                      isTie
                        ? 'bg-slate-800 text-slate-400 border-slate-700'
                        : isUserWinner
                        ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                        : 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30'
                    )}
                  >
                    {isTie ? (
                      'Égalité'
                    ) : (
                      <>
                        <Crown className="w-3 h-3" />
                        <span>
                          {isUserWinner ? userProfile.full_name.split(' ')[0] : rival.full_name.split(' ')[0]} +
                          {Math.abs(lift.userVal - lift.rivalVal)} {lift.unit}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* User Stats */}
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">Vous</span>
                    <span className={cn('text-sm font-black', isUserWinner ? 'text-amber-300' : 'text-slate-300')}>
                      {lift.userVal} {lift.unit}
                    </span>
                    {userRatio && (
                      <span className="text-[10px] text-amber-400/80 block font-mono">
                        {userRatio}x PDC
                      </span>
                    )}
                  </div>

                  {/* Rival Stats */}
                  <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block">{rival.full_name.split(' ')[0]}</span>
                    <span className={cn('text-sm font-black', !isUserWinner && !isTie ? 'text-cyan-300' : 'text-slate-300')}>
                      {lift.rivalVal} {lift.unit}
                    </span>
                    {rivalRatio && (
                      <span className="text-[10px] text-cyan-400/80 block font-mono">
                        {rivalRatio}x PDC
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
