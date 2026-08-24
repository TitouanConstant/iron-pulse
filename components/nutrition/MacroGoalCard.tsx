'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { GOAL_LABELS } from '@/lib/calculations/bmr';
import { FitnessGoal } from '@/lib/types';
import { Target, Flame, Sparkles, ShieldAlert, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MacroGoalCard() {
  const { profile, updateProfile } = useApp();

  const handleSelectGoal = (goal: FitnessGoal) => {
    updateProfile({ goal });
  };

  const totalCal = profile.target_calories ?? 2500;
  const targetProtein = profile.target_protein_g ?? 160;
  const targetCarbs = profile.target_carbs_g ?? 260;
  const targetFat = profile.target_fat_g ?? 70;

  const proteinCal = targetProtein * 4;
  const carbsCal = targetCarbs * 4;
  const fatCal = targetFat * 9;

  const proteinPct = Math.round((proteinCal / totalCal) * 100) || 25;
  const fatPct = Math.round((fatCal / totalCal) * 100) || 25;
  const carbsPct = Math.max(0, 100 - (proteinPct + fatPct));

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-black text-white">Objectif & Répartition des Macros</h3>
          <p className="text-xs text-slate-400">Stratégie nutritionnelle sur-mesure</p>
        </div>
      </div>

      {/* Goal selection grid */}
      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(GOAL_LABELS) as FitnessGoal[]).map((g) => {
          const info = GOAL_LABELS[g];
          const isSelected = profile.goal === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => handleSelectGoal(g)}
              className={cn(
                'p-3 rounded-2xl border text-left transition-all active:scale-95',
                isSelected
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/15'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              )}
            >
              <div className="text-xs font-black">{info.title}</div>
              <div className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{info.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Target calories & macros display */}
      <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Cible Calorique Quotidienne</span>
          <div className="text-xl font-black text-amber-400 font-mono">
            {totalCal} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
        </div>

        {/* Macro visual bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
          <div className="bg-rose-500 h-full" style={{ width: `${proteinPct}%` }} title={`Protéines ${proteinPct}%`} />
          <div className="bg-amber-400 h-full" style={{ width: `${carbsPct}%` }} title={`Glucides ${carbsPct}%`} />
          <div className="bg-cyan-400 h-full" style={{ width: `${fatPct}%` }} title={`Lipides ${fatPct}%`} />
        </div>

        {/* 3 Macro Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          {/* Protein */}
          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
            <span className="text-[10px] font-bold text-rose-400 uppercase">Protéines</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {targetProtein}g
            </div>
            <div className="text-[10px] text-slate-400">{proteinPct}% ({proteinCal} kcal)</div>
          </div>

          {/* Carbs */}
          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
            <span className="text-[10px] font-bold text-amber-400 uppercase">Glucides</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {targetCarbs}g
            </div>
            <div className="text-[10px] text-slate-400">{carbsPct}% ({carbsCal} kcal)</div>
          </div>

          {/* Fat */}
          <div className="bg-slate-800/80 rounded-xl p-2.5 border border-slate-700">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Lipides</span>
            <div className="text-lg font-black text-white font-mono mt-0.5">
              {targetFat}g
            </div>
            <div className="text-[10px] text-slate-400">{fatPct}% ({fatCal} kcal)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
