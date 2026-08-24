'use client';

import React from 'react';
import { useApp } from '@/lib/store/app-context';
import { ACTIVITY_LABELS, ACTIVITY_MULTIPLIERS, calculateMetabolism } from '@/lib/calculations/bmr';
import { ActivityLevel, BMRFormula, Gender } from '@/lib/types';
import { Activity, Flame, HeartPulse, Sparkles, Scale, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BMRCalculatorCard() {
  const { profile, updateProfile } = useApp();

  const meta = calculateMetabolism(
    profile.current_weight_kg || 80,
    profile.height_cm || 178,
    profile.age || 25,
    profile.gender || 'male',
    profile.activity_level || 'moderate',
    profile.formula || 'mifflin'
  );

  return (
    <div className="glass-card rounded-3xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Calculateur BMR & TDEE</h3>
            <p className="text-xs text-slate-400">Métabolisme de Base & Dépense Énergétique Totale</p>
          </div>
        </div>

        {/* Formula switch */}
        <div className="flex bg-slate-900 border border-slate-700 rounded-xl p-0.5">
          <button
            type="button"
            onClick={() => updateProfile({ formula: 'mifflin' })}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all',
              profile.formula === 'mifflin'
                ? 'bg-amber-400 text-black'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Mifflin-St Jeor
          </button>
          <button
            type="button"
            onClick={() => updateProfile({ formula: 'harris_benedict' })}
            className={cn(
              'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all',
              profile.formula === 'harris_benedict'
                ? 'bg-amber-400 text-black'
                : 'text-slate-400 hover:text-white'
            )}
          >
            Harris-Benedict
          </button>
        </div>
      </div>

      {/* Results Banner */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-800 text-center shadow-inner">
          <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center gap-1">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>BMR (Repos strict)</span>
          </span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {meta.selectedFormulaBMR} <span className="text-xs text-amber-400 font-bold">kcal</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Énergie vitale au repos</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/20 to-slate-900 rounded-2xl p-3.5 border border-amber-400/40 text-center shadow-inner">
          <span className="text-[10px] uppercase font-black text-amber-400 flex items-center justify-center gap-1">
            <Activity className="w-3 h-3" />
            <span>TDEE (Maintenance)</span>
          </span>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">
            {meta.tdee} <span className="text-xs text-amber-400 font-bold">kcal</span>
          </div>
          <p className="text-[10px] text-slate-300 mt-0.5">Dépense réelle journalière</p>
        </div>
      </div>

      {/* Profile Parameters Inputs */}
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 pt-1">
        {/* Gender */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sexe</label>
          <select
            value={profile.gender}
            onChange={(e) => updateProfile({ gender: e.target.value as Gender })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-2 text-xs font-bold text-white outline-none focus:border-amber-400"
          >
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Âge</label>
          <input
            type="number"
            value={profile.age}
            onChange={(e) => updateProfile({ age: parseInt(e.target.value, 10) || 25 })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-2 text-xs font-bold text-white outline-none focus:border-amber-400 text-center font-mono"
          />
        </div>

        {/* Height */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Taille (cm)</label>
          <input
            type="number"
            value={profile.height_cm}
            onChange={(e) => updateProfile({ height_cm: parseFloat(e.target.value) || 178 })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-2 text-xs font-bold text-white outline-none focus:border-amber-400 text-center font-mono"
          />
        </div>

        {/* Current Weight */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Poids (kg)</label>
          <input
            type="number"
            step="0.1"
            value={profile.current_weight_kg || 80}
            onChange={(e) => updateProfile({ current_weight_kg: parseFloat(e.target.value) || 80 })}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-2 text-xs font-bold text-amber-400 outline-none focus:border-amber-400 text-center font-mono"
          />
        </div>
      </div>

      {/* Activity Level Selector */}
      <div className="pt-2">
        <label className="block text-xs font-bold text-slate-300 mb-2">
          Niveau d'Activité Physique (Facteur d'activité : &times;{meta.activityMultiplier})
        </label>
        <div className="space-y-1.5">
          {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((lvl) => {
            const info = ACTIVITY_LABELS[lvl];
            const isSelected = profile.activity_level === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => updateProfile({ activity_level: lvl })}
                className={cn(
                  'w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all',
                  isSelected
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                )}
              >
                <div>
                  <div className="text-xs font-bold">{info.title}</div>
                  <div className="text-[10px] text-slate-400">{info.desc}</div>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  &times;{ACTIVITY_MULTIPLIERS[lvl]}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
